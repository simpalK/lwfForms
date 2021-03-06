package models.domain.beo

import anorm.SqlParser.get
import anorm.{RowParser, ~}
import models.domain.NutrientsPlotInfo

import scala.math.BigDecimal

case class Plot(clnr: Int, x: BigDecimal, y: BigDecimal, z: BigDecimal, latitude: BigDecimal, langitude: BigDecimal, kanton: String, clusterName: String, ortName: String)

object PlotData {
  val parser: RowParser[Plot] = {
      get[Int]("CLNR") ~
      get[BigDecimal]("x") ~
      get[BigDecimal]("y") ~
      get[BigDecimal]("z") ~
      get[BigDecimal]("latitude") ~
      get[BigDecimal]("longitude") ~
      get[String]("KANTON") ~
      get[String]("CLNAME") ~
      get[String]("GEMEINDE") map {
      case clnr~x~y~z~latitude~longitude~kanton~clname~gemeinde => Plot(clnr,x,y,z,latitude,longitude,kanton,clname,gemeinde)
    }
  }
}

case class PlotExtended(plot: Plot, trees: Seq[TreeData], bgcTrees: Seq[Naehrstoffe], bgcPlot: Seq[NutrientsPlotInfo])
