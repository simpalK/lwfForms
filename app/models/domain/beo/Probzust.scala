package models.domain.beo

import anorm.SqlParser.get
import anorm.{RowParser, ~}

case class Probzust(art: Int, text: String)

object ProbzustData {
  val parser: RowParser[Probzust] = {
    get[Int]("code") ~
      get[String]("TEXT") map {
      case art~text => Probzust(art, text)
    }
  }
}