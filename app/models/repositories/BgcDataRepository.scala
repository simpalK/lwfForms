package models.repositories

import javax.inject.Inject

import anorm._
import models.domain._
import models.domain.bgc._
import models.domain.beo._
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

   def findAllTrees(): Seq[TreeData] = bgcdb.withConnection { implicit connection =>
      SQL("select banreti, ab.text, max(ba.umfang), max(a.bahoehe) from ba,bwsi a, artbed ab where banreti > 9000 and banreti < 10000 and clnr = {} and umfang is not null and a.banr = ba.banr and a.invnr = ba.invnr and ba.bart = ab.art and ba.sprache = ab.sprache group by banreti,ab.text order by banreti").as(TreeData.parser *)}


   def findAllNutrients(): Seq[NutrientsPlotInfo] = bgcdb.withConnection { implicit connection =>
      SQL("select clnr, probdat, witterung, besteiger_nr, protokoll_nr, bemerkung, besteiger_nr2, protokoll_nr2 from nae_feld_aufn_v1").as(NutrientsPlotData.parser *)}

}
