package schedulers

import javax.inject.{Inject, Singleton}

import akka.actor.Actor
import models.domain.bgc.GenevaTaxonomy
import models.services.LichenService
import models.util.FtpConnector
import parsers.DatFileWriter
import play.api.{Configuration, Logger}

import scala.concurrent.ExecutionContext

@Singleton
class SchedulerActor @Inject()(configuration: Configuration, meteoService: LichenService)(implicit ec: ExecutionContext) extends Actor {
  override def receive: Receive = {
    case "writeFile" =>  {
      writeFile()
      readFile()
    }
  }

  def readFile(): Unit ={
    /*val pathInputFile = configuration.getString("pathInputFile").get
    val userNameFtp = configuration.getString("fptUserNameMeteo").get
    val passwordFtp = configuration.getString("ftpPasswordMeteo").get
    val pathForFtpFolder = configuration.getString("ftpPathForOutgoingFile").get
    val ftpUrlMeteo = configuration.getString("ftpUrlMeteo").get
    FtpConnector.readFileFromFtp(userNameFtp, passwordFtp, pathForFtpFolder, ftpUrlMeteo)
     //DatFileReader.readFilesFromFile(pathInputFile)
    Logger.debug(pathInputFile)*/
  }

  def writeFile(): Unit ={
  /*  val pathInputFile = configuration.getString("pathInputFile").get
    val userNameFtp = configuration.getString("fptUserNameMeteo").get
    val passwordFtp = configuration.getString("ftpPasswordMeteo").get
    val pathForFtpFolder = configuration.getString("ftpPathForOutgoingFile").get
    val ftpUrlMeteo = configuration.getString("ftpUrlMeteo").get
    Logger.debug("writing data task running")
    val dataToWrite: Seq[GenevaTaxonomy] = meteoService.getLatestMeteoDataToWrite(192,1)
    FtpConnector.writeFileToFtp(dataToWrite: Seq[GenevaTaxonomy], userNameFtp, passwordFtp, pathForFtpFolder, ftpUrlMeteo)
    DatFileWriter.writeDataIntoFile(pathInputFile, dataToWrite)
    Logger.debug("writing data task finished")*/
  }
}
