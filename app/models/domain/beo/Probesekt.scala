package models.domain.beo

import anorm.SqlParser.get
import anorm.{RowParser, ~}

/**
  * Created by Kumar on 25.01.2018.
  */
case class Probesekt(art: String, text: String)

object ProbesektData {
  val parser: RowParser[Probesekt] = {
    get[String]("code") ~
      get[String]("TEXT") map {
      case art~text => Probesekt(art, text)
    }
  }
}