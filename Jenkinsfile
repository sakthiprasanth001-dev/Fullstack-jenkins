pipeline {
    agent any

    tools {
        nodejs "nodejs"
    }

    environment {
        SONAR_HOME = tool "sonar-scanner"
        NEXUS_URL = "52.66.247.88:8082"
        NEXUS_REPO = "docker-hosted"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                url: 'https://github.com/sakthiprasanth001-dev/Fullstack-jenkins.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                        sh """
                        node -v
                        npm -v

                        ${SONAR_HOME}/bin/sonar-scanner \
                        -Dsonar.projectKey=fullstack-app \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=http://52.66.247.88:9000 \
                        -Dsonar.login=$SONAR_TOKEN
                        """
                    }
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

        stage('Push Backend to Nexus') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'nexus-login', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                    sh """
                    docker logout ${NEXUS_URL} || true
                    echo $NEXUS_PASS | docker login ${NEXUS_URL} -u $NEXUS_USER --password-stdin

                    docker tag backend-app ${NEXUS_URL}/${NEXUS_REPO}/backend-app:latest
                    docker push ${NEXUS_URL}/${NEXUS_REPO}/backend-app:latest
                    """
                }
            }
        }

        stage('Push Frontend to Nexus') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'nexus-login', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                    sh """
                    echo $NEXUS_PASS | docker login ${NEXUS_URL} -u $NEXUS_USER --password-stdin

                    docker tag frontend-app ${NEXUS_URL}/${NEXUS_REPO}/frontend-app:latest
                    docker push ${NEXUS_URL}/${NEXUS_REPO}/frontend-app:latest
                    """
                }
            }
        }

        stage('Run Backend') {
            steps {
                sh """
                docker rm -f backend || true
                docker pull ${NEXUS_URL}/${NEXUS_REPO}/backend-app:latest
                docker run -d -p 5000:5000 --name backend ${NEXUS_URL}/${NEXUS_REPO}/backend-app:latest
                """
            }
        }

        stage('Run Frontend') {
            steps {
                sh """
                docker rm -f frontend || true
                docker pull ${NEXUS_URL}/${NEXUS_REPO}/frontend-app:latest
                docker run -d -p 3000:3000 --name frontend ${NEXUS_URL}/${NEXUS_REPO}/frontend-app:latest
                """
            }
        }
    }

    post {
        success {
            echo "PIPELINE SUCCESS 🚀"

        }

        failure {
            echo "PIPELINE FAILED ❌"

        }
    }
}
