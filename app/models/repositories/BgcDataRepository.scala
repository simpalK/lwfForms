package models.repositories

import java.sql.{SQLException, Statement}
import javax.inject.Inject

import anorm._
import models.domain.{BgcOracleError, NutrientsPlotData, NutrientsPlotInfo}
import models.domain.beo._
import models.util.StringToDate
import org.joda.time.DateTime
import play.api.Logger
import play.api.db.DBApi


@javax.inject.Singleton
class BgcDataRepository  @Inject()(dbapi: DBApi) {

    private val bgcdb = dbapi.database("default")
    private val beodb = dbapi.database("beo")

   def findAllLwfplots(): Seq[Plot] = beodb.withConnection { implicit connection =>
     SQL("""select lt.sitename,cl.x,cl.y,cl.z50 as z,cl.latitude, cl.longitude,k.text as kanton,cl.clname, g.text as gemeinde, cl.clnr
           |from cl,kanton k,gemeinde g, LWF_ST lt
           |where cl.kanton = k.code and cl.gemeinde = g.code
           |and cl.clnr = lt.lwf_clnr
           |group by lt.sitename,cl.x,cl.y,cl.z50,cl.latitude, cl.longitude,k.text,cl.clname, g.text, cl.clnr""".stripMargin).as(PlotData.parser *)}

   def findAllpersons() : Seq[Person] = beodb.withConnection { implicit connection =>
     SQL("select persnr, name, vorname from pers order by name").as(PersonData.parser *)}

   /*def findAllTrees(): Seq[TreeData] = beodb.withConnection { implicit connection =>
      SQL("select ba.clnr, to_number(banreti) banreti, ab.text species, max(ba.umfang) umfang, max(a.bahoehe) bahoehe from ba,bwsi a, artbed ab where banreti > 9000 and banreti < 10000 and umfang is not null and a.banr = ba.banr and a.invnr = ba.invnr and ba.bart = ab.art and ba.sprache = ab.sprache group by ba.clnr,banreti,ab.text order by banreti").as(TreeData.parser *)}*/

  def findAllTrees(): Seq[TreeData] = beodb.withConnection { implicit connection =>
    SQL("""select ba.clnr, to_number(banreti) banreti, ab.text species,i.invyear, (max(ba.umfang) over(partition by ba.banreti, ba.clnr, ba.invnr)) * 10 umfang, (max(a.bahoehe) over(partition by ba.banreti, ba.clnr, ba.invnr)) * 10 bahoehe, ba.bstat
    from ba,bwsi a, artbed ab,inv_info i
    where banreti > 9000 and banreti < 10000 and a.banr = ba.banr
    and a.invnr = ba.invnr and ba.bart = ab.art and ba.invnr in (29994,29995,29996,29997,29998,30057)
    and ba.sprache = ab.sprache
    and i.invnr in (29994,29995,29996,29997,29998,30057)
    and i.type_of_plot = 'LWF' and a.invnr = ba.invnr
    and i.invnr = ba.invnr
    and i.clnr = ba.clnr
    order by clnr, to_number(banreti)""").as(TreeData.parser *)}


  def findAllNutrients(): Seq[NutrientsPlotInfo] = bgcdb.withConnection { implicit connection =>
      SQL("select clnr, probdat, witterung, besteiger_nr, protokoll_nr, bemerkung, besteiger_nr2, protokoll_nr2 from nae_feld_aufn_v1").as(NutrientsPlotData.parser *)}

   def findAllNutrientsData(): Seq[Naehrstoffe] = bgcdb.withConnection { implicit connection =>
     SQL("""select n.clnr, to_number(n.banreti) banreti, n.probsekt, n.leiter, n.stangenschere, n.entnhoehe,
              probzust, feld_bem, ank_datum, bhu, entnart, valbhu, valbhubem, anker,round(c.x) as x, round(c.y) as y
       from nae_feld_dat_v n, beo.ba b, beo.cl c
       where to_char(probdat, 'yyyy') = to_char(sysdate, 'yyyy') - 2
       and n.clnr = b.clnr
       and n.banreti = b.banreti
       and b.baclnr = c.clnr
       and b.invnr = 29999
       order by clnr, to_number(banreti)""".stripMargin).as(NaehrstoffeData.parser *)
   }

   def findAllNutrientsDataForPlotOnDate(clnr: Int, forDate: String): Seq[Naehrstoffe] = bgcdb.withConnection { implicit connection => {
     SQL("""select clnr, to_number(banreti) banreti, probsekt, leiter, stangenschere, entnhoehe, probzust, feld_bem, ank_datum, bhu, entnart, valbhu, valbhubem, anker from nae_feld_dat_v where clnr = {clnrnr} and to_char(probdat,'dd.mm.yyyy') =  {ofDate} order by clnr, to_number(banreti)""".stripMargin).on("clnrnr" -> clnr, "ofDate" -> forDate).as(NaehrstoffeData.parser *)
    }
   }

  def getProbzust() = bgcdb.withConnection { implicit connection =>
    SQL("""select * from NAE_PROBZUST""".stripMargin).as(ProbzustData.parser *)}

  def getEntart() = bgcdb.withConnection { implicit connection =>
    SQL("""select * from NAE_ENTNART""".stripMargin).as(EntartData.parser *)}

  def getProbeSekt() = bgcdb.withConnection { implicit connection =>
    SQL("""select * from NAE_NPROBSEKT""".stripMargin).as(ProbesektData.parser *)}

  def getValidDef() = bgcdb.withConnection { implicit connection =>
    SQL("""select * from VALID""".stripMargin).as(ValidDefData.parser *)}


  def saveNutrientData(nutrient: NutrientsPlotInfo, username: String): Option[BgcOracleError] = {
      val conn = bgcdb.getConnection()
      try {
        conn.setAutoCommit(false)
        val stmt: Statement = conn.createStatement()
        val probdatum = s"to_date('${StringToDate.oracleDateFormat.print(nutrient.probdat)}', 'DD.MM.YYYY HH24:MI:SS')"

        val insertStatement =
          s"""insert into nae_feld_aufn_v1 (clnr, probdat, witterung, besteiger_nr, protokoll_nr, bemerkung, besteiger_nr2, protokoll_nr2, einfuser, einfdat)
        values( ${nutrient.clnr}, ${probdatum}, ${nutrient.witterung.map("'" + _ + "'").orNull}, ${nutrient.besteiger_nr.orNull}, ${nutrient.protokoll_nr.orNull}, ${nutrient.bemerkung.map("'" + _ + "'").orNull}, ${nutrient.besteiger_nr2.orNull},${nutrient.protokoll_nr2.orNull}, '${username}', sysdate)""".stripMargin

        Logger.debug(s"statement to be executed: ${insertStatement}")
        stmt.executeUpdate(insertStatement)

        stmt.close()

        val stmt2: Statement = conn.createStatement()
        nutrient.trees.map(m => {
          val ankerDatum = s"to_date('${StringToDate.oracleDateFormat.print(nutrient.probdat)}', 'DD.MM.YYYY HH24:MI:SS')"
          val insertStatement2 =
            s"""insert into nae_feld_dat_v (clnr, probdat, banreti, probsekt, leiter, stangenschere, entnhoehe, probzust,
                       feld_bem, ank_datum, bhu, entnart, valbhu, valbhubem,  einfuser, einfdat, anker)
                       values (${m.clnr}, ${probdatum}, '${m.banreti}', '${m.probsekt}', ${m.leiter.map("'" + _ + "'").orNull}, ${m.stangenschere.map(l=> "'" + l + "'" ).orNull}, ${m.entnhoehe.orNull},${m.probzust.orNull}, ${m.feld_bem.map("'" + _ + "'").orNull}, ${ankerDatum}, ${m.bhu.orNull}, ${m.entnart.orNull}, ${m.valbhu.orNull}, ${m.valbhubem.map("'" + _ + "'").orNull}, '${username}', sysdate, ${m.anker.orNull})""".stripMargin

          Logger.debug(s"statement to be executed: ${insertStatement2}")
          stmt2.executeUpdate(insertStatement2)

        })
          //code that throws sql exception
        stmt2.close()
        conn.commit()
        conn.close()
        None
      } catch {
        case ex: SQLException => {
          if (ex.getErrorCode() == 1) {
            Logger.debug(s"Data was already read. Primary key violation ${ex}")
            conn.rollback()
            conn.close()
            Some(BgcOracleError(8, s"Oracle Exception: ${ex}"))
          } else {
            conn.close()
            Logger.debug(s"Data was not read. error ${ex}")
            Some(BgcOracleError(8, s"Oracle Exception: ${ex}"))
          }

        }
      }
  }




def updateNutrientData(nutrient: NutrientsPlotInfo, oldProbeDatum: DateTime, username: String): Option[BgcOracleError] = {
  val conn = bgcdb.getConnection()
  try {
  conn.setAutoCommit(false)
  val stmt: Statement = conn.createStatement()
  val probdatum = s"to_date('${StringToDate.oracleDateFormat.print(nutrient.probdat)}', 'DD.MM.YYYY HH24:MI:SS')"
  val oldProbdatum = s"to_date('${StringToDate.oracleDateFormat.print(oldProbeDatum)}', 'DD.MM.YYYY HH24:MI:SS')"

  val stmt2: Statement = conn.createStatement()
  nutrient.trees.map(m => {
    val ankerDatum = s"to_date('${StringToDate.oracleDateFormat.print(nutrient.probdat)}', 'DD.MM.YYYY HH24:MI:SS')"
    val updateStatement2 =
      s"""update nae_feld_dat_v set (probdat,probsekt,leiter,stangenschere,entnhoehe,probzust,feld_bem,ank_datum,bhu,entnart,valbhu,valbhubem, updateuser, updatedate, anker)
           = (select ${probdatum}, '${m.probsekt}', ${m.leiter.map("'" + _ + "'").orNull}, ${m.stangenschere.map(l=> "'" + l + "'" ).orNull},
          ${m.entnhoehe.orNull}, ${m.probzust.orNull}, ${m.feld_bem.map("'" + _ + "'").orNull}, ${ankerDatum}, ${m.bhu.orNull}, ${m.entnart.orNull},
                    ${m.valbhu.orNull}, ${m.valbhubem.map("'" + _ + "'").orNull}, '${username}', sysdate, ${m.anker.orNull} from dual)
                       where clnr = ${m.clnr} and probdat = ${oldProbdatum} and banreti = '${m.banreti}' and probsekt = '${m.probsekt}'""".stripMargin
    Logger.debug(s"statement to be executed: ${updateStatement2}")
    stmt2.executeUpdate(updateStatement2)
  })
  //code that throws sql exception
  stmt2.close()

  val updateStatement =
  s"""update nae_feld_aufn_v1 set (witterung,probdat,besteiger_nr,protokoll_nr,bemerkung,besteiger_nr2,protokoll_nr2, updateuser, updatedate) = (SELECT ${nutrient.witterung.map("'" + _ + "'").orNull},
        ${probdatum},
        ${nutrient.besteiger_nr.orNull} ,
        ${nutrient.protokoll_nr.orNull} ,
        ${nutrient.bemerkung.map("'" + _ + "'").orNull},
        ${nutrient.besteiger_nr2.orNull},
       ${nutrient.protokoll_nr2.orNull}, '${username}', sysdate from dual)
      where clnr = ${nutrient.clnr} and probdat = ${oldProbdatum}""".stripMargin

  Logger.debug(s"statement to be executed: ${updateStatement}")
  stmt.executeUpdate(updateStatement)
  stmt.close()
  conn.commit()
  conn.close()
  None
} catch {
  case ex: SQLException => {
  if (ex.getErrorCode() == 1) {
  Logger.debug(s"Data was already read. Primary key violation ${ex}")
  conn.rollback()
  conn.close()
  Some(BgcOracleError(8, s"Oracle Exception: ${ex}"))
} else {
  conn.close()
  Logger.debug(s"Data was not read. error ${ex}")
  Some(BgcOracleError(8, s"Oracle Exception: ${ex}"))
}

}
}
}

}

