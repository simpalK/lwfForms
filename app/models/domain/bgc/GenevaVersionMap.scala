package models.domain.bgc

import anorm.SqlParser.get
import anorm.{RowParser, ~}

case class GenevaVersionMap(code: Int,
                            text: String,
                            taxVersion: Int,
                            state: String,
                            insertionDate: String,
                            event: String
                           )

object GenevaVersionMap {
  val parser: RowParser[GenevaVersionMap] = {
    get[Int]("CODE") ~
      get[String]("nom_complet") ~
      get[Int]("tax_version") ~
      get[String]("state") ~
      get[String]("insertion_date")~
      get[String]("event") map {
      case code ~ text ~ taxVersion~ state ~insertionDate ~event   => {
        GenevaVersionMap(code, text, taxVersion, state, insertionDate, event)
      }
    }
  }
}