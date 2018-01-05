package models.domain

import anorm.SqlParser.get
import anorm.{RowParser, ~}

case class Ligru(code: Int, name: String)

object Ligru {
  val parser: RowParser[Ligru] = {
    get[Int]("CODE") ~
      get[String]("TEXT") map {
              case code~name => Ligru(code,name)
    }
  }
}