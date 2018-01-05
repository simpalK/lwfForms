package models.domain.bgc

import anorm.SqlParser.get
import anorm.{RowParser, ~}

case class Synonym(noNom: Int,
                          nomComplet: Option[String]
                         )

object Synonym {
  val parser: RowParser[Synonym] = {
    get[Int]("no_nom") ~
      get[Option[String]]("nom_complet") map {
      case noNom ~ nomComplet =>
      {
        Synonym(noNom, nomComplet)
      }
    }
  }
}
