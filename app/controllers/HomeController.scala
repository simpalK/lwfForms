package controllers

import javax.inject._

import models.domain.{NutrientsPlotData, NutrientsPlotInfo}
import models.services.BgcService
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import play.api.mvc.Controller
import play.api.i18n.I18nSupport
import play.api.i18n.MessagesApi
import play.api.i18n.Messages.Implicits._
import play.api.Play.current
import play.api.i18n.Messages.Implicits._
import play.api.routing.JavaScriptReverseRouter

/**
  * This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class HomeController @Inject()(bgcService: BgcService) extends Controller {

  import java.util.Properties

  val props: Properties = System.getProperties
  props
    .setProperty("oracle.jdbc.J2EE13Compliant", "true")

  val allplots = bgcService.getAllPlots
  val allPers = bgcService.getAllPersons






  def javascriptRoutes = Action { implicit request =>
    Ok(
      JavaScriptReverseRouter("jsRoutes")(
        routes.javascript.HomeController.index
      )
    ).as("text/javascript")
  }

  def index = Action { implicit request =>

    Redirect(controllers.routes.HomeController.nutrients)
  }

  def nutrients = Action { implicit request =>
    NutrientsPlotData.nutrientsForm.bindFromRequest.fold(
      errors => BadRequest(views.html.index(errors, allplots, allPers)),
      nutrient => Ok{
        views.html.nutrients(nutrient)
      }

    )
  }



}

