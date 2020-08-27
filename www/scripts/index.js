(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);


        var botaoLogin = document.querySelector("#btn-login");
        botaoLogin.addEventListener("click", Login);

        var botaoCreate = document.querySelector("#btn-create");
        botaoCreate.addEventListener("click", Registar);

        var botaoCreaterecuperar = document.querySelector("#btn-createrecuperar");
        botaoCreaterecuperar.addEventListener("click", Recuperar);

        var botaoApagar = document.querySelector("#btn-apagar");
        botaoApagar.addEventListener("click", Apagar);

        var botaoAtualiza = document.querySelector("#btn-atualiza");
        botaoAtualiza.addEventListener("click", Atualiza);

        var botaoSend = document.querySelector("#btn-send");
        botaoSend.addEventListener("click", Inserir);

        var botaoApagarDoc = document.querySelector("#btn-apagar-doc");
        botaoApagarDoc.addEventListener("click", EliminaDoc);

        var botaoBaixar = document.querySelector("#btn-baixar");
        botaoBaixar.addEventListener("click", Baixar);


        //var botaoLoading = document.querySelector("#btn-loading");
        //botaoLoading.addEventListener("click", loading);


        //$(document).on("pageshow", "#page_home", function () {

        //    //var ultimoEmail = localStorage.getItem("simpliFY_email");
        //    //$("#txt-email").val(ultimoEmail);  

        //});

        $(document).on("pagebeforeshow", "#page_pesquisar", function () {
            VerDocumentos();
        });

        var botaoPesquisar = document.querySelector("#btn-pesquisar");
        botaoPesquisar.addEventListener("click", Pesquisar);

    }

    //Mostra ultimo email..
    var ultimoEmail = localStorage.getItem("simpliFY_email");
    document.getElementById("txt-email").value = ultimoEmail;

    function Login() {

        var email = $("#txt-email").val();
        var password = $("#txt-password").val();
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function (firebaseUser) {
                // Success        

                // guarda ultimo email
                var check = document.getElementById("checkbox-mini-lembrar");
                if (check.checked === true) {
                    localStorage.setItem("simpliFY_email", email);
                }

                $.mobile.changePage("#page_newmenu");
            })
            .catch(function (error) {
                // Handle Errors here.
                //var errorCode = error.code;
                //var errorMessage = error.message;

               navigator.notification.alert("There was an error with your E-Mail/Password combination. Please try again.", "", "Attention", "Ok");
              // window.alert("sometext")

            });
    }//Login

    function Registar() {

        var passwordfirst = $("#txt-password-createfirst").val();
        var check = document.getElementById("checkbox-mini-0");

        var email = $("#txt-email-create").val();
        var password = $("#txt-password-create").val();

        if (emailIsValid(email) === false) {
            navigator.notification.alert("Please, enter a valid email address", "", "Attention", "Ok");
            return;
        }

        if (passwordfirst.length < 6) {
            navigator.notification.alert("Password must have 6 or more characters", "", "Attention", "Ok");
            $("#txt-password-create").val('');
            $("#txt-password-createfirst").val("");
            return;
        }

        if (passwordfirst !== password) {
            navigator.notification.alert("Passwords doesn't match", "", "Attention", "Ok");
            $("#txt-password-create").val('');
            $("#txt-password-createfirst").val("");
            return;
        }
        if (check.checked === false) {
            navigator.notification.alert("You must agree with terms and conditions", "", "Attention", "Ok");
            return;
        }

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function (firebaseUser) {
                // Success
                navigator.notification.alert("New user successfully created", "", "We Simplify", "Ok");

                $("#txt-email-create").val("");
                $("#txt-password-create").val('');
                $("#txt-password-createfirst").val("");
                $("#checkbox-mini-0")[0].checked = false;

                $.mobile.changePage("#page_home");
            })
            .catch(function (error) {
                // Error Handling
                //var errorCode = error.code;
                //var errorMessage = error.message;
                navigator.notification.alert("Please, try again!", "", "Error", "Ok");;
            });

    }//Registar





    //Outras funções
    function emailIsValid(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User logged in already or has just logged in.
            //console.log(user.uid);
            iduser = user.uid;
        } else {
            // User not logged in or has just logged out.
        }
    });


    function Recuperar() {
        var auth = firebase.auth();
        var email = $("#txt-email-createrecuperar").val();
        if (emailIsValid(email) === false) {
            navigator.notification.alert("Pelase, enter a valid email address", "", "Attention", "Ok");
            return;
        }

        auth.sendPasswordResetEmail(email).then(function () {
            navigator.notification.alert("Successfully sent", "", "We Simplify", "Ok");

            $("#txt-email-createrecuperar").val("");
            $.mobile.changePage("#page_home");

        }).catch(function (error) {
            navigator.notification.alert("Please, try again!", "", "Error", "Ok");

        });
    }//Recuperar

    function Apagar() {
        var user = firebase.auth().currentUser;
        user.delete().then(function () {
            navigator.notification.alert("Your account was successfully deleted", "", "We Simplify", "Ok");

            $.mobile.changePage("#page_home");
        }).catch(function (error) {
            navigator.notification.alert("Please, try again!", "", "Error", "Ok");

        });
    }//Apagar

    function Atualiza() {
        var user = firebase.auth().currentUser;
        var passwordatualizafirst = $("#txt-passwordatualizafirst").val();
        var passwordatualiza = $("#txt-passwordatualiza").val();

        if (passwordatualizafirst.length < 6) {
            navigator.notification.alert("Password must have 6 or more characters", "", "Attention", "Ok");

            return;
        }
        if (passwordatualizafirst !== passwordatualiza) {
            navigator.notification.alert("Passwords doesn't match", "", "Attention", "Ok");

            return;
        }

        user.updatePassword(passwordatualiza).then(function () {
            navigator.notification.alert("Your password was successfully updated!", "", "We Simplify", "Ok");

            $("#txt-passwordatualiza").val('');
            $("#txt-passwordatualizafirst").val('');

            $.mobile.changePage("#page_home");

        }).catch(function (error) {
            navigator.notification.alert("Please, try again!", "", "Error", "Ok");
        });
    }//Atualiza

    function Inserir() {

        $("#sendDiv").show();

        var nome = $("#docname").val();
        var data = $("#verificationdate").val();

        var fp = $("#file");
        //var lg = fp[0].files.length; // get length
        var items = fp[0].files;
        var fileType = items[0].type; // get file type
        var file = items[0];

        // Add a new document in collection Iduser
        db.collection(iduser).doc(nome).set({
            Nome: nome,
            Data: data,
            Imagem: nome
        })
            .then(function () {
                //alert("Documento Inserido!");               
            })
            .catch(function (error) {
                navigator.notification.alert("Please, try again!", "", "Error", "Ok");
            });


        //envio ficheiro
        var metadata = {
            'contentType': fileType
        };

        var auth = firebase.auth();
        var storageRef = firebase.storage().ref();

        storageRef.child(iduser + '/' + nome).put(file, metadata)

            .then(function (snapshot) {

                $("#sendDiv").hide();
                navigator.notification.alert("Successfully uploaded!", "", "We Simplify", "Ok");

                $("#docname").val("");
                $("#verificationdate").val("");
                $("#file").val("");

                $.mobile.changePage("#page_newmenu");

                // Let's get a download URL for the file.
                //snapshot.ref.getDownloadURL().then(function (url) {
                //    //console.log('File available at', url);                   
                //});
            })

            .catch(function (error) {
                //console.error('Upload failed:', error);               
            });
    }//Inserir



    function EliminaDoc() {


        //elimina ficheiro
        var storage = firebase.storage();
        var storageRef = storage.ref();

        var fileRef = storageRef.child(iduser + '/' + nomeDoc);
        fileRef.delete().then(function () {
            //Sucesso
        }).catch(function (error) {
            console.log("Error removing file: ", error);
        });


        //Elimina collection/document
        db.collection(iduser).doc(nomeDoc).delete().then(function () {
            navigator.notification.alert("Successfully deleted!", "", "We Simplify", "Ok");
            //alert("Cartão eliminado com sucesso!");
            $.mobile.changePage("#page_pesquisar");

        }).catch(function (error) {
            //alert("Error removing document: ", error);
        });

    }

    function Baixar() {

        //var fileURL = "///storage/emulated/0/DCIM/myFile";

        var store = cordova.file.dataDirectory;
        var assetURL = urlDoc;
        var fileName = nomeDoc;
        var fileTransfer = new FileTransfer();

        fileTransfer.download(assetURL, store + fileName,
            function (entry) {
                navigator.notification.alert("Successfully downloaded!", "", "We Simplify", "Ok");
                //console.log("Success!");             
            },
            function (err) {
                //console.log("Error");
                //console.dir(err);
                navigator.notification.alert("Please, try again!", "", "Error", "Ok");
            });
    }


    var arrayDocumentos = new Array();
    function VerDocumentos() {

        $("#loaderDiv").show();

        var i = 0;
        var primeiro = true;
        var ultimoDoc = "";

        db.collection(iduser).get().then(function (querySnapshot) {

            var html = '<ul data-role="listview" data-inset="true" class="ui-listview ui-listview-inset ui-corner-all ui-shadow">';

            querySnapshot.forEach(function (doc) {

                if (primeiro === true) {
                    html += '<li class="ui-first-child"><a class="ui-btn ui-btn-icon-right ui-icon-carat-r" href="javascript: VerImagem(\'' + doc.id + '\')">' + doc.id + '</a></li>';
                    primeiro = false;
                }
                else {
                    html += '<li><a class="ui-btn ui-btn-icon-right ui-icon-carat-r" href="javascript: VerImagem(\'' + doc.id + '\')">' + doc.id + '</a></li>';
                }

                arrayDocumentos[i] = doc.id;
                ultimoDoc = doc.id;
                i++;

            });

            if (i > 1) {
                //pesquisa posicao do ultima <li>
                var n = html.lastIndexOf("<li>");

                //html sem o utlimo <li>
                html = html.substring(0, n);

                //adicionar o ulitmo <li> com class="ui-last-child"
                html += '<li class="ui-last-child"><a class="ui-btn ui-btn-icon-right ui-icon-carat-r" href="javascript: VerImagem(\'' + ultimoDoc + '\')">' + ultimoDoc + '</a></li>';
            }

            html += "</ul>";


            if (i === 0) {
                html = "<p>There are no documents to show...</p>";
            }

            $("#show").html(html);
            $("#loaderDiv").hide();
        });
    }//VerDocumentos


    function Pesquisar() {

        var textoPesquisa = $("#text-search").val().toUpperCase();
        var encontrou = false;
        var primeiro = true;
        var ultimoDoc = "";
        var nItens = 0;

        var html = '<ul data-role="listview" data-inset="true" class="ui-listview ui-listview-inset ui-corner-all ui-shadow">';
        for (var i = 0; i < arrayDocumentos.length; i++) {

            var strlinha = arrayDocumentos[i].toUpperCase();
            if (strlinha.includes(textoPesquisa)) {
                nItens++;
                if (primeiro === true) {
                    html += '<li class="ui-first-child"><a class="ui-btn ui-btn-icon-right ui-icon-carat-r" href="javascript: VerImagem(\'' + arrayDocumentos[i] + '\')">' + arrayDocumentos[i] + '</a></li>';
                    primeiro = false;
                }
                else {
                    html += '<li><a class="ui-btn ui-btn-icon-right ui-icon-carat-r" href="javascript: VerImagem(\'' + arrayDocumentos[i] + '\')">' + arrayDocumentos[i] + '</a></li>';
                }
                encontrou = true;
                ultimoDoc = arrayDocumentos[i];
            }
        }

        if (nItens > 1) {
            //pesquisa posicao do ultima <li>
            var n = html.lastIndexOf("<li>");

            //html sem o utlimo <li>
            html = html.substring(0, n);

            //adicionar o ulitmo <li> com class="ui-last-child"
            html += '<li class="ui-last-child"><a class="ui-btn ui-btn-icon-right ui-icon-carat-r" href="javascript: VerImagem(\'' + ultimoDoc + '\')">' + ultimoDoc + '</a></li>';
        }

        html += "</ul>";

        if (encontrou === false) {
            html = "<p>There are no documents to show...</p>";
        }

        $("#show").html(html);

    }//Pesquisar

    function loading()
    {
        alert("Funciona");
        $("#loaderDiv1").show();
    }


    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    }

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    }
})();