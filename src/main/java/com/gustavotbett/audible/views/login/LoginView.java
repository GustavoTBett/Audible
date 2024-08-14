package com.gustavotbett.audible.views.login;

import com.gustavotbett.audible.security.AuthenticatedUser;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.login.LoginForm;
import com.vaadin.flow.component.login.LoginI18n;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.BeforeEnterEvent;
import com.vaadin.flow.router.BeforeEnterObserver;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import org.springframework.beans.factory.annotation.Autowired;

@AnonymousAllowed
@PageTitle("Login")
@Route(value = "login")
public class LoginView extends VerticalLayout implements BeforeEnterObserver {

    @Autowired
    private AuthenticatedUser authenticatedUser;
    
    private LoginForm loginForm = new LoginForm();
    private String temaLumo;

    public void login() {

        setHeight("100%");
        setJustifyContentMode(JustifyContentMode.CENTER);
        setAlignItems(Alignment.CENTER);
        
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
        add(toggleButton);

        Button logo = new Button("Audible");
        logo.addClickListener(listener -> {
            UI.getCurrent().getPage().setLocation("home");
        });
        logo.addThemeVariants(ButtonVariant.LUMO_TERTIARY_INLINE);

        add(new HorizontalLayout(toggleButton, logo));

        LoginI18n i18n = LoginI18n.createDefault();
        LoginI18n.Form i18nForm = i18n.getForm();
        i18nForm.setTitle("Acesse sua conta");
        i18nForm.setUsername("Email do usuário");
        i18nForm.setPassword("Senha");
        i18nForm.setSubmit("Logar");
        i18nForm.setForgotPassword("Esqueci a senha");
        i18n.setForm(i18nForm);

        LoginI18n.ErrorMessage i18nErrorMessage = i18n.getErrorMessage();
        i18nErrorMessage.setTitle("Usuário ou senha incorreta");
        i18nErrorMessage.setUsername("Usuário é obrigatório");
        i18nErrorMessage.setPassword("Senha é obrigatório");
        i18nErrorMessage.setMessage(
                "Verificar se digitou o usuário e a senha corretamente ou clique em esqueci a senha.");
        i18n.setErrorMessage(i18nErrorMessage);

        loginForm.setI18n(i18n);
        loginForm.setAction("login");
        loginForm.setForgotPasswordButtonVisible(false);
//        loginForm.addForgotPasswordListener(listener -> {
//            getUI().ifPresent(ui -> ui.navigate("esqueci-a-senha"));
//        });

        Icon vaadinIcon = new Icon(VaadinIcon.PLUS_CIRCLE);
        Button souNovo = new Button("Sou novo", vaadinIcon);
        souNovo.addClickListener(listener -> {
            getUI().ifPresent(ui -> ui.navigate("novo-usuario"));
        });

        add(loginForm);
    }

    @Override
    public void beforeEnter(BeforeEnterEvent event) {
        if (authenticatedUser.get().isPresent()) {
            // Already logged in
            event.forwardTo(""); // Redirect to the main page or dashboard
        }

        loginForm.setError(event.getLocation().getQueryParameters().getParameters().containsKey("error"));
        
        getElement().executeJs("return document.documentElement.getAttribute('theme')").then(String.class, resultHandler -> {
            if (resultHandler != null) {
                temaLumo = resultHandler;
            } else {
                temaLumo = "light";
            }
            login();
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
