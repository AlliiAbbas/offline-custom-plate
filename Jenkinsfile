pipeline {
  agent {
    kubernetes {
      inheritFrom 'docker-enabled-agent-v3' // Your existing k8s Jenkins agent
      defaultContainer 'jnlp'
      yamlFile 'jenkins/k8s/jenkins-pod.yaml'
    }
  }

  environment {
    DOCKER_IMAGE = "masec11112020/nuxt-app"
    DOCKER_HUB_CREDS = credentials('dockerhub-creds')
    KUBE_DEPLOYMENT_NAME = "nuxt-app"
    KUBE_NAMESPACE = "default"
    KUBE_CONTAINER_NAME = "nuxt-container"
    INGRESS_HOST = "ecip-demo.easycash.eg"
  }

  stages {
    stage('Checkout Code') {
      steps {
        checkout scm
      }
    }

    stage('Determine Git Tag or Branch') {
      steps {
        script {
          def gitTag = sh(script: "git describe --tags --abbrev=0 || echo ''", returnStdout: true).trim()
          def gitBranch = sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()

          if (gitTag) {
            env.BUILD_TAG = gitTag.replaceAll("/", "-")
          } else {
            env.BUILD_TAG = gitBranch.replaceAll("/", "-") + "-" + env.BUILD_NUMBER
          }

          echo "🛠 Using Docker Tag: ${env.BUILD_TAG}"
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        container('docker') {
          sh '''
            echo "🔨 Building Docker image..."
            docker build -t $DOCKER_IMAGE:$BUILD_TAG .
          '''
        }
      }
    }

    stage('Push Docker Image') {
      steps {
        container('docker') {
          withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
            sh '''
              echo "🚀 Pushing Docker image to DockerHub..."
              echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
              docker push $DOCKER_IMAGE:$BUILD_TAG
            '''
          }
        }
      }
    }

    stage('Update Kubernetes Deployment') {
      steps {
        container('kubectl') {
          sh '''
            echo "🔄 Updating Kubernetes Deployment..."
            kubectl set image deployment/$KUBE_DEPLOYMENT_NAME $KUBE_CONTAINER_NAME=$DOCKER_IMAGE:$BUILD_TAG -n $KUBE_NAMESPACE
          '''
        }
      }
    }

    stage('Health Check') {
      steps {
        container('kubectl') {
          sh '''
            echo "🔎 Waiting for deployment to stabilize..."
            kubectl rollout status deployment/$KUBE_DEPLOYMENT_NAME -n $KUBE_NAMESPACE --timeout=60s
            echo "🌍 Checking if frontend is up..."
            curl --fail --max-time 10 https://$INGRESS_HOST || exit 1
          '''
        }
      }
    }
  }

  post {
    success {
      echo "✅ Pipeline completed successfully. Version: ${env.VERSION}"
      script {
        sh """
        curl -X POST -H 'Content-type: application/json' \
        --data '{"text":"✅ *SUCCESS* - ${env.JOB_NAME} [#${env.BUILD_NUMBER}](${env.BUILD_URL})\\n📦 Version: ${env.BUILD_TAG}"}' \
        https://hooks.slack.com/services/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
        """
      }
    }

    failure {
      echo "❌ Pipeline failed. Investigate above logs."
      script {
        sh """
        curl -X POST -H 'Content-type: application/json' \
        --data '{"text":"❌ *FAILURE* - ${env.JOB_NAME} [#${env.BUILD_NUMBER}](${env.BUILD_URL})\\n⚠️ Check the logs."}' \
        https://hooks.slack.com/services/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
        """
      }
    }

    always {
      echo "🧹 Cleaning up if necessary"
    }
  }
}
