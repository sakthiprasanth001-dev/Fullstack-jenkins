pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git 'https://github.com/sakthiprasanth001-dev/Fullstack-jenkins.git'
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

        stage('Run Containers') {
            steps {
                sh '''
                docker stop backend || true
                docker rm backend || true
                docker run -d -p 5000:5000 --name backend backend-app

                docker stop frontend || true
                docker rm frontend || true
                docker run -d -p 3000:3000 --name frontend frontend-app
                '''
            }
        }
    }
}
