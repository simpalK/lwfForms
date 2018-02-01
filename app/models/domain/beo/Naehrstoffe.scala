package models.domain.beo

import java.util.Date

import anorm.SqlParser.get
import anorm.{RowParser, ~}
import models.util.StringToDate
import org.joda.time.DateTime
import play.api.libs.json.Json

import scala.math.BigDecimal

case class Naehrstoffe(clnr: Int,
                       banreti: Int,
                       probsekt: String,
                       leiter: Option[String],
                       stangenschere: Option[String],
                       entnhoehe: Option[BigDecimal],
                       probzust: Option[Int],
                       feld_bem: Option[String],
                       ank_datum: Option[DateTime],
                       bhu: Option[BigDecimal],
                       entnart: Option[Int],
                       valbhu: Option[Int],
                       valbhubem: Option[String]
                   )

object NaehrstoffeData {
  val parser: RowParser[Naehrstoffe] = {
      get[Int]("clnr") ~
      get[Int]("banreti") ~
      get[String]("probsekt") ~
      get[Option[String]]("leiter") ~
      get[Option[String]]("stangenschere") ~
      get[Option[BigDecimal]]("entnhoehe") ~
      get[Option[Int]]("probzust") ~
      get[Option[String]]("feld_bem") ~
      get[Option[DateTime]]("ank_datum")~
      get[Option[BigDecimal]]("bhu") ~
      get[Option[Int]]("entnart") ~
      get[Option[Int]]("valbhu") ~
      get[Option[String]]("valbhubem") map {
      case clnr ~  banreti ~ probsekt ~ leiter ~ stangenschere ~ entnhoehe ~ probzust ~ feld_bem ~ ank_datum ~ bhu ~ entnart ~ valbhu ~ valbhubem  =>
      {
        Naehrstoffe(clnr , banreti , probsekt , leiter , stangenschere , entnhoehe , probzust , feld_bem , ank_datum, bhu , entnart , valbhu , valbhubem)
      }
    }
  }

}