package models.domain.beo

import anorm.SqlParser.get
import anorm.{RowParser, ~}

import scala.math.BigDecimal



case class TreeData(banreti: Option[Int],
                    species: Option[String],
                    umfang: Option[BigDecimal],
                    bahoehe: Option[BigDecimal]
                    )

object TreeData {
  val parser: RowParser[TreeData] = {
    get[Option[Int]]("banreti") ~
      get[Option[String]]("species") ~
      get[Option[BigDecimal]]("umfang") ~
      get[Option[BigDecimal]]("bahoehe") map {
      case banreti ~ species ~ umfang ~ bahoehe =>
      {
        TreeData(banreti, species, umfang, bahoehe)
      }
    }
  }
}