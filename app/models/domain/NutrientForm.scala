package models.domain

import anorm.SqlParser.get
import anorm.{RowParser, ~}
import models.domain.beo.Naehrstoffe
import org.joda.time.DateTime
import play.api.data._
import play.api.data.Forms._

case class NutrientsPlotInfo(clnr: Int, probdat: DateTime, witterung: Option[String], besteiger_nr : Option[Int], protokoll_nr: Option[Int], bemerkung: Option[String], besteiger_nr2 : Option[Int], protokoll_nr2: Option[Int], trees: List[Naehrstoffe])

object NutrientsPlotData {
  val parser: RowParser[NutrientsPlotInfo] = {
    get[Int]("clnr") ~
      get[DateTime]("probdat")~
      get[Option[String]]("witterung") ~
      get[Option[Int]]("besteiger_nr") ~
      get[Option[Int]]("protokoll_nr") ~
      get[Option[String]]("bemerkung")~
      get[Option[Int]]("besteiger_nr2") ~
      get[Option[Int]]("protokoll_nr2") map {
      case clnr~probdat~witterung~besteiger_nr~protokoll_nr~bemerkung~besteiger_nr2~protokoll_nr2 => NutrientsPlotInfo(clnr, probdat, witterung, besteiger_nr, protokoll_nr, bemerkung, besteiger_nr2, protokoll_nr2, List())
    }
  }

  val nutrientsForm = Form(
    mapping(
      "clnr" -> number,
      "probdat" -> jodaDate,
      "witterung" -> optional(text),
      "besteiger_nr" -> optional(number),
      "protokoll_nr" -> optional(number),
      "bemerkung" -> optional(text),
      "besteiger_nr2" -> optional(number),
      "protokoll_nr2" -> optional(number),
      "trees" -> list(mapping(
        "clnr" -> number,
        "banreti" -> number,
        "probsekt" -> text,
        "leiter" -> optional(text),
          "stangenschere"-> optional(text),
          "entnhoehe"-> optional(bigDecimal),
          "probzust"-> optional(number),
          "feld_bem"-> optional(text),
          "ank_datum"-> optional(jodaDate),
          "bhu"-> optional(bigDecimal),
          "entnart"-> optional(number),
          "valbhu"-> optional(number),
          "valbhubem" -> optional(text),
          "anker" -> optional(number),
        "x" -> optional(bigDecimal),
        "y" -> optional(bigDecimal)
      )(Naehrstoffe.apply)(Naehrstoffe.unapply))
    )(NutrientsPlotInfo.apply)(NutrientsPlotInfo.unapply)
  )
}

