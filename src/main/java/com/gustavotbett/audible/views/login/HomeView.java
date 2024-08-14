package com.gustavotbett.audible.views.login;

import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.Image;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.orderedlayout.FlexComponent;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.BeforeEnterEvent;
import com.vaadin.flow.router.BeforeEnterObserver;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.auth.AnonymousAllowed;

@AnonymousAllowed
@PageTitle("Home")
@Route(value = "home")
@JsModule("./prefers-color-scheme.js")
public class HomeView extends VerticalLayout implements BeforeEnterObserver {

    private String temaLumo;

    public void LoginView() {
        Icon circuloHalf;
        if (temaLumo.equals("light")) {
            circuloHalf = new Icon("moon-o");
        } else {
            circuloHalf = new Icon("sun-o");
        }
        Button toggleButton = new Button(circuloHalf);
        toggleButton.addClickListener(click -> {
            trocaTema();
            if (temaLumo == null || temaLumo.equals("light")) {
                toggleButton.setIcon(new Icon("moon-o"));
            } else {
                toggleButton.setIcon(new Icon("sun-o"));
            }
        });

        Button btn = new Button("Login");
        btn.addClickListener(listener -> {
            UI.getCurrent().getPage().setLocation("login");
        });

        HorizontalLayout headerButtons = new HorizontalLayout(toggleButton, btn);
        HorizontalLayout header = new HorizontalLayout(new H1("Audible"), headerButtons);
        header.setWidth("100%");
        header.setJustifyContentMode(FlexComponent.JustifyContentMode.BETWEEN);
        header.getStyle().set("padding", "5px 20px");

        Image img = new Image("images/64705e36d6c173f75626cf6b_Blog-Cover-2022_02_How-to-Transcribe-Audio-to-Text-_Automatically-_-For-Fre.png", "image to text");

        Span text = new Span("Bem-vindo ao nosso aplicativo inovador de transcrição de áudio para texto!"
                + " Desenvolvido para facilitar a vida de quem precisa converter áudios em textos escritos,"
                + " nosso aplicativo é uma ferramenta poderosa e intuitiva, ideal para estudantes, profissionais,"
                + " jornalistas e qualquer pessoa que precise transformar gravações em textos de forma rápida e eficiente.");

        VerticalLayout vlHome = new VerticalLayout(img, text);

        UI.getCurrent().getPage().retrieveExtendedClientDetails(details -> {
            int windowWidth = details.getWindowInnerWidth();
            if (windowWidth > 1200) {
                img.getStyle().set("border-radius", "20px").set("width", "800px");
                text.setWidth("450px");
                text.getStyle().set("font-size", "24px").set("font-weight", "600");
                vlHome.setAlignItems(Alignment.CENTER);
                vlHome.setJustifyContentMode(JustifyContentMode.CENTER);
                vlHome.getStyle().set("margin-top", "40px").set("flex-direction", "row");
            } else {
                img.getStyle().set("border-radius", "20px").set("width", "380px");
                text.getStyle().set("font-size", "24px").set("font-weight", "600");
                vlHome.setAlignItems(Alignment.CENTER);
                vlHome.setJustifyContentMode(JustifyContentMode.CENTER);
                vlHome.getStyle().set("margin-top", "40px");
            }
        });
        add(header, vlHome);
    }

    @Override
    public void beforeEnter(BeforeEnterEvent event) {
        getElement().executeJs("return document.documentElement.getAttribute('theme')").then(String.class, resultHandler -> {
            if (resultHandler != null) {
                temaLumo = resultHandler;
            } else {
                temaLumo = "light";
            }
            LoginView();
        });
    }

    public void trocaTema() {
        String js;

        if (temaLumo.equals("light") || temaLumo.equals("")) {
            js = "document.documentElement.setAttribute('theme', 'dark')";
            temaLumo = "dark";
        } else {
            js = "document.documentElement.setAttribute('theme', 'light')";
            temaLumo = "light";
        }

        getElement().executeJs(js, "");
    }
}
