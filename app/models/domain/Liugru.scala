package models.domain
import anorm.SqlParser.get
import anorm.{RowParser, ~}

case class Liugru(code: Int, name: String)

object Liugru {
  val parser: RowParser[Liugru] = {
    get[Int]("CODE") ~
      get[String]("TEXT") map {
      case code~name => Liugru(code,name)
    }
  }
}