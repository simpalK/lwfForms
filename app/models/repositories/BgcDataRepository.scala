package models.repositories

import java.sql.{SQLException, Statement}
import javax.inject.Inject

import anorm._
import models.domain.{BgcOracleError, NutrientsPlotData, NutrientsPlotInfo}
import models.domain.beo._
import models.util.StringToDate
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
     SQL("select persnr, name, vorname from pers").as(PersonData.parser *)}

   def findAllTrees(): Seq[TreeData] = beodb.withConnection { implicit connection =>
      SQL("select ba.clnr, to_number(banreti) banreti, ab.text species, max(ba.umfang) umfang, max(a.bahoehe) bahoehe from ba,bwsi a, artbed ab where banreti > 9000 and banreti < 10000 and umfang is not null and a.banr = ba.banr and a.invnr = ba.invnr and ba.bart = ab.art and ba.sprache = ab.sprache group by ba.clnr,banreti,ab.text order by banreti").as(TreeData.parser *)}

   def findAllNutrients(): Seq[NutrientsPlotInfo] = bgcdb.withConnection { implicit connection =>
      SQL("select clnr, probdat, witterung, besteiger_nr, protokoll_nr, bemerkung, besteiger_nr2, protokoll_nr2 from nae_feld_aufn_v1").as(NutrientsPlotData.parser *)}

   def findAllNutrientsData(): Seq[Naehrstoffe] = bgcdb.withConnection { implicit connection =>
     SQL("select clnr, to_number(banreti) banreti, probsekt, leiter, stangenschere, entnhoehe, probzust, feld_bem, ank_datum, bhu, entnart, valbhu, valbhubem from nae_feld_dat_v where to_char(probdat, 'yyyy') = to_char(sysdate, 'yyyy') -1").as(NaehrstoffeData.parser *)
     //SQL("select clnr, to_number(banreti) banreti, probsekt, leiter, stangenschere, entnhoehe, probzust, feld_bem, to_char(ank_datum, 'DD-MM-YYYY HH24:MI:SS') ank_datum, bhu, entnart, valbhu, valbhubem from nae_feld_dat_v where to_char(probdat, 'yyyy') = to_char(sysdate, 'yyyy') -1").as(NaehrstoffeData.parser *)
   }

  def getProbzust() = bgcdb.withConnection { implicit connection =>
    SQL("""select * from NAE_PROBZUST""".stripMargin).as(ProbzustData.parser *)}

  def getEntart() = bgcdb.withConnection { implicit connection =>
    SQL("""select * from NAE_ENTNART""".stripMargin).as(EntartData.parser *)}

  def getProbeSekt() = bgcdb.withConnection { implicit connection =>
    SQL("""select * from NAE_NPROBSEKT""".stripMargin).as(ProbesektData.parser *)}

  def getValidDef() = bgcdb.withConnection { implicit connection =>
    SQL("""select * from VALID""".stripMargin).as(ValidDefData.parser *)}


  def saveNutrientData(nutrient: NutrientsPlotInfo): Option[BgcOracleError] = {
      val conn = bgcdb.getConnection()
      try {
        conn.setAutoCommit(false)
        val stmt: Statement = conn.createStatement()
        val probdatum = s"to_date('${StringToDate.oracleDateFormat.print(nutrient.probdat)}', 'DD.MM.YYYY HH24:MI:SS')"

        val insertStatement =
          s"""insert into nae_feld_aufn_v1 (clnr, probdat, witterung, besteiger_nr, protokoll_nr, bemerkung, besteiger_nr2, protokoll_nr2)
        values( ${nutrient.clnr}, ${probdatum}, ${nutrient.witterung.orNull}, ${nutrient.besteiger_nr}, ${nutrient.protokoll_nr}, ${nutrient.bemerkung.orNull}, ${nutrient.besteiger_nr2},${nutrient.protokoll_nr2})""".stripMargin

        Logger.debug(s"statement to be executed: ${insertStatement}")
        stmt.executeUpdate(insertStatement)

        stmt.close()

        val stmt2: Statement = conn.createStatement()
        nutrient.trees.map(m => {
          val ankerDatum = s"to_date('${StringToDate.oracleDateFormat.print(nutrient.probdat)}', 'DD.MM.YYYY HH24:MI:SS')"
          val insertStatement2 =
            s"""insert into nae_feld_dat_v (clnr, probdat, banreti, probsekt, leiter, stangenschere, entnhoehe, probzust,
                       feld_bem, ank_datum, bhu, entnart, valbhu, valbhubem)
                       values (${m.clnr}, ${probdatum}, '${m.banreti}', '${m.probsekt}', ${m.leiter.orNull}, ${m.stangenschere.map(l=> "'" + l + "'" ).orNull}, ${m.entnhoehe.orNull},${m.probzust.orNull}, ${m.feld_bem.orNull}, ${ankerDatum}, ${m.bhu.orNull}, ${m.entnart.orNull}, ${m.valbhu.orNull}, ${m.valbhubem.orNull})""".stripMargin

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

}
