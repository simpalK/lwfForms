name := """lwf-forms"""

version := "1.0.0"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.11"

libraryDependencies ++= Seq(jdbc, cache ,ws , "org.scalatestplus.play" %% "scalatestplus-play" % "2.0.0" % Test ,
  "com.typesafe.play" %% "play-json" % "2.5.14",
  "com.typesafe.play" %% "anorm" % "2.5.0",
  "com.jcraft" % "jsch" % "0.1.53",
  "org.flywaydb" %% "flyway-play" % "3.1.0",
  "com.unboundid" % "unboundid-ldapsdk" % "2.3.6"
)




