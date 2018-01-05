package models.domain.bgc

import anorm.SqlParser.get
import anorm.{RowParser, ~}

case class GenevaParentKeyMap(code: Int,
                              taxVersion: Int,
                              parentCode: Int,
                              parentTaxVersion: Int,
                              insertionDate: String,
                              event: String
                            )

object GenevaParentKeyMap {
  val parser: RowParser[GenevaParentKeyMap] = {
    get[Int]("CODE") ~
      get[Int]("tax_version")~
      get[Int]("parent_code") ~
      get[Int]("parent_tax_version") ~
      get[String]("insertion_date")~
      get[String]("event") map {
      case code ~ taxVersion ~ parentCode ~ parentTaxVersion ~ insertionDate ~ event  => {
        GenevaParentKeyMap(code, taxVersion, parentCode, parentTaxVersion, insertionDate, event)
      }
    }
  }
}