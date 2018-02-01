package models.domain.beo

import anorm.SqlParser.get
import anorm.{RowParser, ~}

case class Entart(art: Int, text: String)

object EntartData {
  val parser: RowParser[Entart] = {
    get[Int]("code") ~
      get[String]("TEXT") map {
      case art~text => Entart(art, text)
    }
  }
}