package models.domain


import anorm.SqlParser.get
import anorm.{Error, Row, RowParser, Success, TypeDoesNotMatch, ~}
import org.joda.time._
import anorm.JodaParameterMetaData._
import org.joda.time._
import org.joda.time.format._

import scala.math.BigInt

sealed abstract class Verdict {
  val code: Int
  val typeValue: String
  def fromCode(code: Int) : Verdict = {
    code match {
      case 1 => Summe
      case 2 => Durchschnitt
      case 3 => Vektor
      case _ => UnKnownVerdict
    }
  }
  def fromTypeValue(typeValue: String) : Verdict = {
    typeValue match {
      case "Summe" => Summe
      case "Durchschnitt" => Durchschnitt
      case "Vektor" => Vektor
      case _ => UnKnownVerdict
    }
  }
}

case object Durchschnitt extends Verdict {
  override val code = 2
  override val typeValue = "Durchschnitt"
}

case object Summe extends Verdict {
  override val code = 1
  override val typeValue = "Summe"
}


case object Vektor extends Verdict {
  override val code = 3
  override val typeValue = "Vektor"
}

case object UnKnownVerdict extends Verdict {
  override val code = -1
  override val typeValue = "Unknown"
}

object Verdict {
  val parser: RowParser[Verdict] = {
    get[Int]("CODE") ~
      get[String]("TEXT") map {
      case code ~ name => code match {
        case 1 => Summe
        case 2 => Durchschnitt
        case 3 => Vektor
        case _ => UnKnownVerdict
      }
    }
  }
}







































































