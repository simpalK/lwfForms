package models.domain.beo

import anorm.SqlParser.get
import anorm.{RowParser, ~}

import scala.math.BigDecimal



case class TreeData(clnr: Int,
                    banreti: Option[Int],
                    species: Option[String],
                    umfang: Option[BigDecimal],
                    bahoehe: Option[BigDecimal]
                    )

object TreeData {
  val parser: RowParser[TreeData] = {
    get[Int]("clnr")~
    get[Option[Int]]("banreti") ~
      get[Option[String]]("species") ~
      get[Option[BigDecimal]]("umfang") ~
      get[Option[BigDecimal]]("bahoehe") map {
      case clnr~banreti ~ species ~ umfang ~ bahoehe =>
      {
        TreeData(clnr, banreti, species, umfang, bahoehe)
      }
    }
  }
}

