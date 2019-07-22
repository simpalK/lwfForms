package controllers

import javax.inject._

import auth.{Conf, LDAP, Security, User}
import models.domain.beo._
import models.domain.{FormatMessage, NutrientsPlotData, NutrientsPlotInfo}
import models.services.BgcService
import models.util.StringToDate
import org.joda.time.DateTime
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import play.api.mvc.Controller
import play.api.i18n.I18nSupport
import play.api.i18n.MessagesApi
import play.api.i18n.Messages.Implicits._
import play.api.Play.current
import play.api.{Logger, _}
import play.api.i18n.Messages.Implicits._
import play.api.libs.json.{JsError, JsSuccess, Json}
import play.api.routing.JavaScriptReverseRouter

/**
  * This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class HomeController @Inject()(bgcService: BgcService) extends Controller with Security {

  import java.util.Properties

  val props: Properties = System.getProperties
  props
    .setProperty("oracle.jdbc.J2EE13Compliant", "true")

  val allplots = bgcService.getAllPlots
  val allPers = bgcService.getAllPersons
  val alltrees = bgcService.getAllTrees.groupBy(t => (t.clnr, t.banreti)).map(_._2.maxBy(_.invnr)).toList
  val allProbesekt = bgcService.getProbeSekt
  val allNutrients = bgcService.getAllNutrientsData
  val allBgcPlots = bgcService.findAllBgcPlots
  val allValidDef = bgcService.getValidDef
  val allPlotExtended = allplots.map(pl => {
    val treesOnThisPlot = alltrees.filter(_.clnr == pl.clnr).filter(t => !t.bstat.contains(3,4))
    val allBgcPlotsForClnr = allBgcPlots.filter(_.clnr == pl.clnr)
    val treeNutrientData = allNutrients.filter(_.clnr == pl.clnr).map(n => n.copy(ank_datum = None, feld_bem = None))
    PlotExtended(pl, treesOnThisPlot, treeNutrientData, allBgcPlotsForClnr)
  })

  val allProbzust = bgcService.getAllProbzust
  val allEntart = bgcService.getAllEntart

  implicit val plotWriter = Json.writes[Plot]
  implicit val plotReader = Json.reads[Plot]

  implicit val treeWriter = Json.writes[TreeData]
  implicit val treeReader = Json.reads[TreeData]

  implicit val naehrstoffeWriter = Json.writes[Naehrstoffe]
  implicit val naehrstoffeReader = Json.reads[Naehrstoffe]

  implicit val nutrientsPlotInfoWriter = Json.writes[NutrientsPlotInfo]
  implicit val nutrientsPlotInfoReader = Json.reads[NutrientsPlotInfo]

  implicit val plotExtWriter = Json.writes[PlotExtended]
  implicit val plotExtReader = Json.reads[PlotExtended]

  implicit val probzustWriter = Json.writes[Probzust]
  implicit val probzustReader = Json.reads[Probzust]

  implicit val entartWriter = Json.writes[Entart]
  implicit val entartReader = Json.reads[Entart]

  implicit val probesektWriter = Json.writes[Probesekt]
  implicit val probesektReader = Json.reads[Probesekt]

  implicit val validDefWriter = Json.writes[ValidDef]
  implicit val validDefReader = Json.reads[ValidDef]

  implicit val psrrsonWriter = Json.writes[Person]
  implicit val psrrsonReader = Json.reads[Person]

  def javascriptRoutes = Action { implicit request =>
    Ok(
      JavaScriptReverseRouter("jsRoutes")(
        routes.javascript.HomeController.index,
        routes.javascript.HomeController.login,
        routes.javascript.HomeController.authenticate,
        routes.javascript.HomeController.logout,
        routes.javascript.HomeController.allPlotsData,
        routes.javascript.HomeController.allPersons,
        routes.javascript.HomeController.allValidDefData,
        routes.javascript.HomeController.allProbeSektData,
        routes.javascript.HomeController.allEntartData,
        routes.javascript.HomeController.allProbzustData
      )
    ).as("text/javascript")
  }


  def index = HasRole(List(Conf.acg1)) {
    uid => _ =>
      Redirect(routes.HomeController.authenticate)
  }

  def login = Action {
    implicit request =>
      Ok(views.html.login(User.loginForm))
  }

  def logout = Action {
     Redirect(routes.HomeController.login).withNewSession.flashing("success" -> "")
  }

  def untrail(path: String) = Action {
    MovedPermanently("/" + path)
  }

  def authenticate = Action {
    implicit request =>
      User.loginForm.bindFromRequest.fold(
        formWithErrors =>
          BadRequest(views.html.login(formWithErrors)),
        user =>
          Redirect(routes.HomeController.nutrients)
            .withSession("uid" -> user._1)
      )
  }


  def nutrients =  IsAuthenticated { username => implicit request =>
      NutrientsPlotData.nutrientsForm.bindFromRequest.fold(
        errors =>
          BadRequest(views.html.index(errors, allPlotExtended, allPers, alltrees)),
        nutrient => Ok {
          views.html.nutrients(nutrient)
        }
      )
  }

  def allPlotsData(clnr: Int) = IsAuthenticated { username => implicit request =>
    val treeData = allPlotExtended.filter(_.plot.clnr == clnr)
    Ok(Json.toJson(treeData))
  }

  def allPlotsDataForDate(clnr: Int, forDate: String) = IsAuthenticated { username => implicit request => {
    val pl = allplots.filter(_.clnr == clnr).headOption
    val treesOnThisPlot = alltrees.filter(_.clnr == clnr)
    val allBgcPlotsForClnr = allBgcPlots.filter(p => p.clnr == clnr && p.probdat == StringToDate.stringToDateConvertWithDot(forDate)).headOption.toSeq
    val treeNutrientData = bgcService.getAllNutrientsDataForPlotOnDate(clnr, forDate)
    val treeData = pl.map(PlotExtended(_, treesOnThisPlot, treeNutrientData, allBgcPlotsForClnr)).toSeq
    Ok(Json.toJson(treeData))
  }
  }


  def allProbzustData() = IsAuthenticated { username => implicit request =>
    Ok(Json.toJson(allProbzust))
  }

  def allEntartData() = IsAuthenticated { username => implicit request =>
    Ok(Json.toJson(allEntart))
  }

  def allProbeSektData() = IsAuthenticated { username => implicit request =>
    Ok(Json.toJson(allProbesekt))
  }

  def allValidDefData() = IsAuthenticated { username => implicit request =>
    Ok(Json.toJson(allValidDef))
  }

  def allPersons() = IsAuthenticated { username => implicit request =>
    Ok(Json.toJson(allPers))
  }

  def saveNutrient = IsAuthenticated { username => implicit request =>
    // this will fail if the request body is not a valid json value
    val bodyAsJson = request.body.asJson.get

    (bodyAsJson \ "plotData").validate[NutrientsPlotInfo] match {
      case success: JsSuccess[NutrientsPlotInfo] => {
        val plot  = success.get
        //var oldProbeDatum = (bodyAsJson \ "oldProbDatumToUpdate").get
        val errorList = bgcService.saveNutrientsInfo(plot, username)
        errorList.isEmpty match {
          case true => Ok ("Validation passed! data for clnr " + plot.clnr + "is saved successful")
          case _    => BadRequest(s"Data was not stored due to Oracle error! ${FormatMessage.formatErrorMessage(Seq((1, errorList)))}")
        }
      }
      case JsError(error) => {
        Logger.debug(s"errors: ${error}")
        BadRequest(s"Validation failed! ${error.map(_._1.path.map(_.toString)).mkString("\n")}")
      }
    }
  }

  def updateNutrient = IsAuthenticated { username => implicit request =>
    // this will fail if the request body is not a valid json value
    val bodyAsJson = request.body.asJson.get

    (bodyAsJson \ "plotData").validate[NutrientsPlotInfo] match {
      case success: JsSuccess[NutrientsPlotInfo] => {
        val plot  = success.get
        var oldProbeDatum = (bodyAsJson \ "oldProbDatumToUpdate").validate[DateTime].get
        val errorList = bgcService.updateNutrientsInfo(plot, oldProbeDatum, username)
        errorList.isEmpty match {
          case true => Ok ("Validation passed! data for clnr " + plot.clnr + "is saved successful")
          case _    => BadRequest(s"Data was not stored due to Oracle error! ${FormatMessage.formatErrorMessage(Seq((1, errorList)))}")
        }
      }
      case JsError(error) => {
        Logger.debug(s"errors: ${error}")
        BadRequest(s"Validation failed! ${error.map(_._1.path.map(_.toString)).mkString("\n")}")
      }
    }
  }


}

