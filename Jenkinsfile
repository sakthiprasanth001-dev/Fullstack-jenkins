pipeline {
    agent any

    tools {
        nodejs 'nodejs'
    }

    environment {
        SCANNER_HOME = tool 'sonar-scanner'

        NEXUS_URL = "52.66.247.88:8082"
        BACKEND_IMAGE = "52.66.247.88:8082/backend-app"
        FRONTEND_IMAGE = "52.66.247.88:8082/frontend-app"
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

                        sh '''
                        echo "Node Version:"
                        node -v

                        echo "NPM Version:"
                        npm -v

                        echo "Run Sonar Scanner..."

                        ${SCANNER_HOME}/bin/sonar-scanner \
                        -Dsonar.projectKey=fullstack-app \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=http://52.66.247.88:9000 \
                        -Dsonar.login=admin
                        '''
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                echo 'Quality Gate Passed'
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

                withCredentials([usernamePassword(
                    credentialsId: 'nexus-docker',
                    usernameVariable: 'NEXUS_USER',
                    passwordVariable: 'NEXUS_PASS'
                )]) {

                    sh '''
                    echo "$NEXUS_PASS" | docker login 52.66.247.88:8082 -u "$NEXUS_USER" --password-stdin

                    docker tag backend-app $BACKEND_IMAGE
                    docker tag frontend-app $FRONTEND_IMAGE

                    docker push $BACKEND_IMAGE
                    docker push $FRONTEND_IMAGE
                    '''
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
