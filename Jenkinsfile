pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/sakthiprasanth001-dev/fullstack.git'
            }
        }

        stage('List Files') {
            steps {
                sh 'ls -al'
            }
        }

        stage('Frontend Check') {
            steps {
                sh 'ls frontend'
            }
        }

        stage('Backend Check') {
            steps {
                sh 'ls backend'
            }
        }

        stage('Docker Test') {
            steps {
                sh 'docker --version'
            }
        }
    }
}