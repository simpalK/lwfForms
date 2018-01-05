package models.domain

import anorm.SqlParser.get
import anorm.{RowParser, ~}

case class LiartGenevaVersionMap(liartCode: Int,
                                 liartVersion: Int,
                                 taxCode: Int,
                                 taxVersion: Int
                             )

object LiartGenevaVersionMap {
  val parser: RowParser[LiartGenevaVersionMap] = {
    get[Int]("liart_code") ~
      get[Int]("liart_version") ~
      get[Int]("genftax_code") ~
      get[Int]("genftax_version") map {
      case liartCode ~ liartVersion ~ taxCode ~ taxVersion  => {
        LiartGenevaVersionMap(liartCode, liartVersion, taxCode, taxVersion)
      }
    }
  }
}