package models.domain

sealed trait BgcExceptions {
  def formatErrorString(s: String): String = {
    s"${s}\n"
  }
}

case class BgcInvalidProjectNumberException(errorCode: Int, errorMessage: String) extends BgcExceptions {
  override def toString() = formatErrorString(errorMessage)
}
case class BgcInvalidStationNumberException(errorCode: Int, errorMessage: String) extends BgcExceptions {
  override def toString() = formatErrorString(errorMessage)
}
case class BgcInvalidNumberOfParametersException(errorCode: Int, errorMessage: String) extends BgcExceptions {
  override def toString() = formatErrorString(errorMessage)
}
case class BgcInvalidDateException(errorCode: Int, errorMessage: String) extends BgcExceptions {
  override def toString() = formatErrorString(errorMessage)
}
case class BgcConfigNotFoundException(errorCode: Int, errorMessage: String) extends BgcExceptions {
  override def toString() = formatErrorString(errorMessage)
}
case class BgcInvalidIntegerFoundException(errorCode: Int, errorMessage: String) extends BgcExceptions {
  override def toString() = formatErrorString(errorMessage)
}
case class BgcNotSufficientParameters(errorCode: Int, errorMessage: String) extends BgcExceptions {
  override def toString() = formatErrorString(errorMessage)
}

case class BgcOracleError(errorCode: Int, errorMessage: String) extends BgcExceptions {
  override def toString() = formatErrorString(errorMessage)
}



object FormatMessage {

  def formatErrorMessage(errors: Seq[(Int, Option[BgcExceptions])]) : String = {
    val groupByLine = errors.sortBy(_._1).groupBy(_._1)
    groupByLine.map(l => {
      s"line number: ${l._1}  errors: ${l._2.map(_._2.toString()).mkString("\n")}"
    }).mkString("\n")
  }
}