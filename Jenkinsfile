pipeline {
    
    agent any

    environment {
        imagename = "pdisec2122/project-movie-app"
        registryCredential = 'dockerhub'
        dockerImage = ''
    }


    stages {

        stage('Cloning Git') {
            steps {
                git([url: 'https://github.com/pdisec2122/project-movie-app', 
                    branch: 'main'])

            }
        }


        stage('Docker build image') {

            steps {
                script {
                    dockerImage = docker.build imagename
                }
            }
        }

        stage('Deploy Image') {
            steps{
                script {
                    docker.withRegistry( 'https://registry.hub.docker.com', registryCredential ) {
                        dockerImage.push("$BUILD_NUMBER")
                        dockerImage.push('latest')
                    }
                }
            }
        }
    
    }

    post {
        always {
            echo "Finished"
        }
    }
