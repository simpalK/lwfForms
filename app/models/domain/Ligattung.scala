package models.domain

import anorm.SqlParser.get
import anorm.{RowParser, ~}

case class Ligattung(code: Int, text: String, status: Int)

object Ligattung {
  val parser: RowParser[Ligattung] = {
    get[Int]("CODE") ~
      get[String]("TEXT") ~
      get[Int]("STATUS") map {
      case code~name~status => Ligattung(code,name,status)
    }
  }
}