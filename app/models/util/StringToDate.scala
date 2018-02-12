package models.util

import java.text.SimpleDateFormat

import org.joda.time.DateTime

/**
  * Created by Kumar on 25.01.2018.
  */
object StringToDate {

  import org.joda.time.format.{DateTimeFormat, DateTimeFormatter}
  val oracleDateFormat: DateTimeFormatter = DateTimeFormat.forPattern("dd.MM.yyyy HH:mm:ss")

  val bgcformatDate: DateTimeFormatter = DateTimeFormat.forPattern("dd-MM-yyyy HH:mm:ss")

  val smallDateFormat: DateTimeFormatter = DateTimeFormat.forPattern("dd.MM.yyyy")

  val jsDateFormat: DateTimeFormatter = DateTimeFormat.forPattern("yyyy-MM-dd")


  def stringToDateConvert(date: String) = {
    //Logger.debug(s"input Date: $date")
    //Logger.debug(s"converted Date: ${formatDate.parseDateTime(date)}")
    bgcformatDate.parseDateTime(date)

  }

  def stringToDateJSConvert(date: String) = {
    //Logger.debug(s"input Date: $date")
    //Logger.debug(s"converted Date: ${formatDate.parseDateTime(date)}")
    jsDateFormat.parseDateTime(date)

  }

  def stringToDateConvertWithDot(date: String) = {
    //Logger.debug(s"input Date: $date")
    //Logger.debug(s"converted Date: ${formatDate.parseDateTime(date)}")
    smallDateFormat.parseDateTime(date)

  }

}

object CurrentSysDateInSimpleFormat {
  def dateNow = new SimpleDateFormat("yyyyMMddHHmmss").format(new  java.util.Date())
}
object Joda {
  implicit def dateTimeOrdering: Ordering[DateTime] = Ordering.fromLessThan(_ isBefore _)
}

