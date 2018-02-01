package models.services

import javax.inject.Inject

import models.domain.{BgcOracleError, LiartGenevaVersionMap, NutrientsPlotInfo}
import models.domain.bgc.{GenevaTaxonomy, Synonym}
import models.domain.beo._
import models.repositories.BgcDataRepository
import play.api.libs.functional.syntax._
import play.api.libs.json._


class BgcService @Inject()(bgcRepo: BgcDataRepository) {

   def getAllPlots = bgcRepo.findAllLwfplots()

   def getAllPersons = bgcRepo.findAllpersons()

   def getAllTrees = bgcRepo.findAllTrees()

   def getAllNutrientsData = bgcRepo.findAllNutrientsData()

   def getAllProbzust = bgcRepo.getProbzust()

   def getAllEntart = bgcRepo.getEntart()

   def getProbeSekt = bgcRepo.getProbeSekt()

   def getValidDef = bgcRepo.getValidDef()

   def saveNutrientsInfo(nutrient: NutrientsPlotInfo) = bgcRepo.saveNutrientData(nutrient)
}
