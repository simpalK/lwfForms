package models.services

import javax.inject.Inject

import models.domain.LiartGenevaVersionMap
import models.domain.bgc.{GenevaTaxonomy, Synonym}
import models.domain.beo.{_}
import models.repositories.BgcDataRepository
import play.api.libs.functional.syntax._
import play.api.libs.json._


class BgcService @Inject()(bgcRepo: BgcDataRepository) {

   def getAllPlots = bgcRepo.findAllLwfplots()

   def getAllPersons = bgcRepo.findAllpersons()
}