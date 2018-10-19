#!/usr/bin/env groovy

pipeline {

  agent any

  stages {
    stage('init') {
      steps {
        script {
          def scmVars = checkout scm
          env.GIT_PREVIOUS_SUCCESSFUL_COMMIT = scmVars.GIT_PREVIOUS_SUCCESSFUL_COMMIT
        }
      }
    }
    stage('web-client') {
      when {
        expression {
          return checkCommit('web-client')
        }
      }
      steps {
        build 'web-client'
      }
    }
    stage('serverless-api') {
      when {
        expression {
          return checkCommit('serverless-api')
        }
      }
      steps {
        build 'serverless-api'
      }
    }
  }
}

def checkCommit(folder) {
  // def branch = env.BRANCH_NAME
  // def branchToCheck = env.GIT_PREVIOUS_SUCCESSFUL_COMMIT
  // if (branch == 'develop' || branch == 'master') {
  echo "change target: ${CHANGE_TARGET}"
  echo "using diff against commit: ${env.GIT_PREVIOUS_SUCCESSFUL_COMMIT}"
  // branchToCheck = env.GIT_PREVIOUS_SUCCESSFUL_COMMIT
  // } else {
  //   echo "using diff againt branch: ${env.GIT_LOCAL_BRANCH}"
  //   branchToCheck = env.GIT_LOCAL_BRANCH
  // }
  def matches = sh(returnStatus:true, script: "git diff --name-only ${env.GIT_PREVIOUS_SUCCESSFUL_COMMIT} | egrep -q '^${folder}'")
  return !matches
}