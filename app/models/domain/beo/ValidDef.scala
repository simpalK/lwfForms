package models.domain.beo

import anorm.SqlParser.get
import anorm.{RowParser, ~}


case class ValidDef(art: Int, text: String)

object ValidDefData {
  val parser: RowParser[ValidDef] = {
    get[Int]("code") ~
      get[String]("TEXT") map {
      case art~text => ValidDef(art, text)
    }
  }
}
