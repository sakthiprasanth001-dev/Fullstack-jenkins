pipeline {
    agent any

    environment {
        SONARQUBE_SERVER = 'sonarqube'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git 'https://github.com/sakthiprasanth001-dev/Fullstack-jenkins.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv("${SONARQUBE_SERVER}") {
                    sh '''
                    /opt/sonar-scanner/sonar-scanner-5.0.1.3006-linux/bin/sonar-scanner \
                      -Dsonar.projectKey=fullstack-app \
                      -Dsonar.sources=. \
                      -Dsonar.host.url=$SONAR_HOST_URL \
                      -Dsonar.login=$SONAR_AUTH_TOKEN
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build Backend') {
            steps {
                sh 'docker build -t backend-app ./backend'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'docker build -t frontend-app ./frontend'
            }
        }

        stage('Run Backend') {
            steps {
                sh 'docker rm -f backend || true'
                sh 'docker run -d -p 5000:5000 --name backend backend-app'
            }
        }

        stage('Run Frontend') {
            steps {
                sh 'docker rm -f frontend || true'
                sh 'docker run -d -p 3000:3000 --name frontend frontend-app'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline Success'
        }
        failure {
            echo '❌ Pipeline Failed'
        }
    }
}
