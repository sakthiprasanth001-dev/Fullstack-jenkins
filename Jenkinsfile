pipeline {

    agent any

    tools {
        nodejs 'nodejs'
    }

    environment {
        SONAR_HOME = tool 'sonar-scanner'
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

                    script {

                        sh """
                        echo "Node Version:"
                        node -v

                        echo "NPM Version:"
                        npm -v

                        echo "Run Sonar Scanner..."

                        ${SONAR_HOME}/bin/sonar-scanner \
                        -Dsonar.projectKey=fullstack-app \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=http://52.66.247.88:9000 \
                        -Dsonar.login=$SONAR_AUTH_TOKEN
                        """
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
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

        stage('Push To Nexus') {
            steps {

                script {

                    sh 'docker tag backend-app 52.66.247.88:8082/backend-app:latest'
                    sh 'docker tag frontend-app 52.66.247.88:8082/frontend-app:latest'

                    docker.withRegistry('http://52.66.247.88:8082', 'nexus-login') {

                        sh 'docker push 52.66.247.88:8082/backend-app:latest'
                        sh 'docker push 52.66.247.88:8082/frontend-app:latest'
                    }
                }
            }
        }
    }

    post {

        success {
            echo '✅ Pipeline SUCCESS'
        }

        failure {
            echo '❌ Pipeline FAILED'
        }
    }
}
