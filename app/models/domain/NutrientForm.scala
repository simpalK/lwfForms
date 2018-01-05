package models.domain

import anorm.SqlParser.get
import anorm.{RowParser, ~}
import play.api.data._
import play.api.data.Forms._

case class NutrientsPlotInfo(clnr: Int, probdat: String, witterung: String, besteiger_nr : Int, protokoll_nr: Int, bemerkung: String, besteiger_nr2 : Int, protokoll_nr2: Int)

object NutrientsPlotData {
  val parser: RowParser[NutrientsPlotInfo] = {
    get[Int]("clnr") ~
      get[String]("probdat")~
      get[String]("witterung") ~
      get[Int]("besteiger_nr") ~
      get[Int]("protokoll_nr") ~
      get[String]("bemerkung")~
      get[Int]("besteiger_nr2") ~
      get[Int]("protokoll_nr2") map {
      case clnr~probdat~witterung~besteiger_nr~protokoll_nr~bemerkung~besteiger_nr2~protokoll_nr2 => NutrientsPlotInfo(clnr, probdat, witterung, besteiger_nr, protokoll_nr, bemerkung, besteiger_nr2, protokoll_nr2)
    }
  }

  val nutrientsForm = Form(
    mapping(
      "clnr" -> number,
      "probdat" -> text,
      "witterung" -> text,
      "besteiger_nr" -> number,
      "protokoll_nr" -> number,
      "bemerkung" -> text,
      "besteiger_nr2" -> number,
      "protokoll_nr2" -> number
    )(NutrientsPlotInfo.apply)(NutrientsPlotInfo.unapply)
  )
}

