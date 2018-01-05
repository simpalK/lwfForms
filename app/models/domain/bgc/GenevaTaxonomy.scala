package models.domain.bgc

import anorm.SqlParser.get
import anorm.{RowParser, ~}

case class GenevaTaxonomy(noNom: Int,
                          noFiche: Option[Int],
                          coFamille: Option[String],
                          nomComplet: Option[String],
                          nomFamille: Option[String],
                          nomGenre: Option[String],
                          nomEspece: Option[String],
                          taxVersion: Int
                         )

object GenevaTaxonomy {
  val parser: RowParser[GenevaTaxonomy] = {
    get[Int]("no_nom") ~
      get[Option[Int]]("no_fiche") ~
      get[Option[String]]("co_famille") ~
      get[Option[String]]("nom_complet") ~
      get[Option[String]]("nom_famille") ~
      get[Option[String]]("nom_genre") ~
      get[Option[String]]("nom_espece") ~
      get[Int]("tax_version") map {
      case noNom ~ noFiche ~ coFamille ~ nomComplet ~ nomFamille ~ nomGenre ~ nomEspece ~ taxVersion =>
        {
          GenevaTaxonomy(noNom, noFiche, coFamille, nomComplet, nomFamille, nomGenre, nomEspece, taxVersion)
        }
    }
  }
}