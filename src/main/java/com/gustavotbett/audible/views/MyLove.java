package com.gustavotbett.audible.views;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dependency.JavaScript;
import com.vaadin.flow.component.dependency.StyleSheet;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.auth.AnonymousAllowed;

/**
 *
 * @author gustavo
 */
@AnonymousAllowed
@Route("gustavo-e-karine")
@PageTitle("Meu Amor")
@JavaScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js")
@JavaScript("https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js")
@StyleSheet("https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css")
public class MyLove extends VerticalLayout {

    public MyLove() {
        setDefaultHorizontalComponentAlignment(Alignment.CENTER);
        setClassName("homeLove");
        getStyle().set("text-align", "center");
        createPage();
    }

    private void createPage() {
        // Adicionar título
        H1 title = new H1("Meu Amor");
        add(title);

        // Adicionar carrossel de imagens
        add(createImageCarousel());

        // Adicionar contador de tempo
        add(createTimeCounter());

        // Adicionar mensagem romântica
        Paragraph message = new Paragraph("Oii amor! ️\nEu te amo de uma forma que fico contando todos os minutos longe de você esperando te encontrar de novo, quero ficar ao seu lado para sempre!");
        add(message);

        add(createYouTubeVideo());
    }

    private Component createImageCarousel() {
        Div carousel = new Div();

        carousel.getElement().setProperty("innerHTML", "<div class=\"carousel\">\n"
                + "  <div><img src=\"https://i.imgur.com/ulYgruC.jpeg\" alt=\"js\" /></div>\n"
                + "  <div><img src=\"https://i.imgur.com/hwPZhsB.jpeg\" alt=\"java\" /></div>\n"
                + "  <div><img src=\"https://i.imgur.com/63eEfNx.jpeg\" alt=\"python\"/></div>\n"
                + "  <div><img src=\"https://i.imgur.com/AukNQ28.jpeg\" alt=\"kotlin\" /></div>\n"
                + "</div>");

        UI.getCurrent().getPage().executeJs(
                "$('.carousel').slick({\n"
                        + "  infinite: true,\n"
                        + "  slidesToShow: 1,\n"
                        + "  slidesToScroll: 1,\n"
                        + "  autoplay: true,\n"
                        + "  arrows: false,\n"
                        + "});"
        );

        return carousel;
    }

    private Component createTimeCounter() {
        Span timeCounter = new Span();
        timeCounter.setId("time-counter");

        // Código JavaScript atualizado para incluir meses
        UI.getCurrent().getPage().executeJs(
                "const startDate = new Date('2024-06-12T19:30:00');\n" +
                        "setInterval(() => {\n" +
                        "  const now = new Date();\n" +
                        "  \n" +
                        "  // Cálculo de anos, meses, dias, horas, minutos, segundos\n" +
                        "  let years = now.getFullYear() - startDate.getFullYear();\n" +
                        "  let months = now.getMonth() - startDate.getMonth();\n" +
                        "  let days = now.getDate() - startDate.getDate();\n" +
                        "  let hours = now.getHours();\n" +
                        "  let minutes = now.getMinutes();\n" +
                        "  let seconds = now.getSeconds() - startDate.getSeconds();\n" +
                        "  \n" +
                        "  // Ajusta para o caso dos dias serem negativos\n" +
                        "  if (days < 0) {\n" +
                        "    months--;\n" +
                        "    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);\n" +
                        "    days += prevMonth.getDate();\n" +
                        "  }\n" +
                        "  \n" +
                        "  // Ajusta para o caso dos meses serem negativos\n" +
                        "  if (months < 0) {\n" +
                        "    years--;\n" +
                        "    months += 12;\n" +
                        "  }\n" +
                        "\n" +
                        "  // Atualiza o contador com os valores corretos\n" +
                        "  document.getElementById('time-counter').textContent = `${years} anos, ${months} meses, ${days} dias, ${hours} horas, ${minutes} minutos, ${seconds} segundos juntos.`;\n" +
                        "  \n" +
                        "}, 1000);"
        );

        return timeCounter;
    }

    private Component createYouTubeVideo() {
        // Criar o iframe para o áudio do YouTube
        String videoHtml = "<iframe id='youtubePlayer' width='0' height='0' src='https://www.youtube.com/embed/q3zqJs7JUCQ?enablejsapi=1&autoplay=0&loop=1&playlist=q3zqJs7JUCQ' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>";

        // Criar um Div para conter o iframe
        Div videoContainer = new Div();
        videoContainer.getElement().setProperty("innerHTML", videoHtml);
        videoContainer.setWidth("0px");
        videoContainer.setHeight("0px");

        // Criar o diálogo
        Dialog dialog = new Dialog();
        dialog.setWidth("400px");

        // Título do diálogo
        Div title = new Div();
        title.setText("Meu Presente");
        title.getStyle().set("font-weight", "bold").set("font-size", "20px");

        // Mensagem do diálogo
        Div message = new Div();
        message.setText("Você é o meu amor e meu mundo!");

        // Botão que fecha o diálogo e inicia o vídeo
        Button loveButton = new Button("Te Amo", event -> {
            dialog.close(); // Fecha o diálogo
            startVideo(); // Inicia o vídeo
        });

        // Adicionando os componentes ao diálogo
        dialog.add(title, message, loveButton);
        dialog.open(); // Abre o diálogo

        // Exibir o videoContainer (iframe) após o diálogo ser fechado
//        dialog.addOpenedChangeListener(e -> {
//            if (!dialog.isOpened()) {
//                videoContainer.setVisible(true); // Mostra o player após fechar o diálogo
//            }
//        });

        // O player é inicialmente oculto
        add(videoContainer); // Adiciona o player ao layout

        return videoContainer;
    }

    private void startVideo() {
        // Iniciar o vídeo através de um comando para o iframe
        getElement().executeJs("document.getElementById('youtubePlayer').contentWindow.postMessage('{\"event\":\"command\",\"func\":\"playVideo\",\"args\":[]}', '*');");
    }
}