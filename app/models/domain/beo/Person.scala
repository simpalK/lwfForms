package models.domain.beo


import anorm.SqlParser.get
import anorm.{RowParser, ~}

case class Person(persnr: Int, name: String, vorname: String)

object PersonData {
  val parser: RowParser[Person] = {
    get[Int]("persnr") ~
      get[String]("name") ~
      get[String]("vorname") map {
      case persnr~name~vorname => Person(persnr,name,vorname)
    }
  }
}
