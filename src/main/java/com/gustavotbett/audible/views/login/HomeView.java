package com.gustavotbett.audible.views.login;

import com.gustavotbett.audible.security.AuthenticatedUser;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.orderedlayout.FlexComponent;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.BeforeEnterEvent;
import com.vaadin.flow.router.BeforeEnterObserver;
import com.vaadin.flow.router.BeforeEvent;
import com.vaadin.flow.router.HasUrlParameter;
import com.vaadin.flow.router.OptionalParameter;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import org.springframework.beans.factory.annotation.Autowired;

@AnonymousAllowed
@PageTitle("Home")
@Route(value = "home")
@JsModule("./prefers-color-scheme.js")
public class HomeView extends VerticalLayout implements BeforeEnterObserver {

    @Autowired
    private AuthenticatedUser authenticatedUser;

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
        
        add(header);
    }
    
    @Override
    public void beforeEnter(BeforeEnterEvent event) {
        getElement().executeJs("return document.documentElement.getAttribute('theme')").then(String.class, resultHandler -> {
            temaLumo = resultHandler;
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
