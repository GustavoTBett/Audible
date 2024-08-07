package com.gustavotbett.audible.views.home;

import com.gustavotbett.audible.security.AuthenticatedUser;
import com.theokanning.openai.audio.CreateTranscriptionRequest;
import com.theokanning.openai.service.OpenAiService;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.Image;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.FlexComponent;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.upload.Upload;
import com.vaadin.flow.component.upload.UploadI18N;
import com.vaadin.flow.component.upload.receivers.MultiFileMemoryBuffer;
import com.vaadin.flow.router.BeforeEnterEvent;
import com.vaadin.flow.router.BeforeEnterObserver;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.theme.lumo.LumoUtility.Margin;
import jakarta.annotation.security.PermitAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@PageTitle("Home")
@Route(value = "")
@PermitAll
public class AppView extends VerticalLayout implements BeforeEnterObserver {

    @Autowired
    private AuthenticatedUser authenticatedUser;

    @Value("${openai.api.key}")
    private String apiKey;

    private String prompt = "Please select an audio transcription";

    private static final int CHUNK_SIZE = 20 * 1024 * 1024;
    private String temaLumo;

    public void appView() {
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

        Button btn = new Button("Sair");
        btn.addClickListener(listener -> {
            authenticatedUser.logout();
        });

        HorizontalLayout headerButtons = new HorizontalLayout(toggleButton, btn);
        HorizontalLayout header = new HorizontalLayout(new H1("Audible"), headerButtons);
        header.setWidth("100%");
        header.setJustifyContentMode(FlexComponent.JustifyContentMode.BETWEEN);
        header.getStyle().set("padding", "5px 20px");

        add(header);

        MultiFileMemoryBuffer buffer = new MultiFileMemoryBuffer();
        Upload upload = new Upload(buffer);
        upload.setAcceptedFileTypes("application/mp3", ".mp3");
        upload.setAutoUpload(true);

        upload.setI18n(createUploadI18n());
        upload.setMaxFiles(1);
        upload.addSucceededListener(event -> {
            String fileName = event.getFileName();
            InputStream inputStream = buffer.getInputStream(fileName);

            try {

                if (inputStream.available() > CHUNK_SIZE) {
                    List<File> tempFiles = splitFile(inputStream, fileName);
                    for (File file : tempFiles) {
                        processFile(file);
                    }

                    showTranscriptionDialog(prompt);
                } else {
                    File tempFile = convertInputStreamToFile(inputStream, fileName);
                    processFile(tempFile);
                    showTranscriptionDialog(prompt);
                }

            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            // Do something with the file data
            // processFile(inputStream, fileName);
        });

        VerticalLayout layout = new VerticalLayout(upload);
        layout.setHeight("75vh");
        layout.setAlignItems(Alignment.CENTER);
        layout.setJustifyContentMode(JustifyContentMode.CENTER);
        add(layout);
    }

    private void showTranscriptionDialog(String transcriptionText) {
        Dialog dialog = new Dialog();

        dialog.setHeaderTitle("Texto convertido");

        Span transcriptionParagraph = new Span(transcriptionText);
        dialog.add(transcriptionParagraph);
        dialog.setWidth("1000px");

        Button copyButton = new Button("Copiar para a área de transferência", VaadinIcon.COPY.create());
        copyButton.addClickListener(click -> {
            getUI().ifPresent(ui -> {
                ui.getPage().executeJs("navigator.clipboard.writeText($0)", transcriptionText);
                Notification.show("Texto copiado para a área de transferência");
            });
        });

        Button closeButton = new Button(new Icon("lumo", "cross"),
                (e) -> dialog.close());
        closeButton.addThemeVariants(ButtonVariant.LUMO_TERTIARY);

        dialog.getHeader()
                .add(closeButton);
        HorizontalLayout buttonsLayout = new HorizontalLayout(copyButton);
        dialog.add(buttonsLayout);

        dialog.open();
    }

    private UploadI18N createUploadI18n() {
        UploadI18N i18n = new UploadI18N();
        i18n.setDropFiles(new UploadI18N.DropFiles().setOne("Arraste o arquivo MP3 aqui...").setMany("Arraste o arquivo MP3 aqui..."));
        i18n.setAddFiles(new UploadI18N.AddFiles().setOne("Adicionar arquivo").setMany("Adicionar arquivos"));
        i18n.setError(new UploadI18N.Error().setTooManyFiles("Arquivos demais.").setFileIsTooBig("O arquivo é muito grande.").setIncorrectFileType("Tipo de arquivo incorreto."));
        i18n.setUploading(new UploadI18N.Uploading().setStatus(new UploadI18N.Uploading.Status().setConnecting("Conectando...").setStalled("Pausado").setProcessing("Processando..."))
                .setRemainingTime(new UploadI18N.Uploading.RemainingTime().setPrefix("tempo restante: ").setUnknown("tempo restante desconhecido"))
                .setError(new UploadI18N.Uploading.Error().setServerUnavailable("Servidor indisponível").setUnexpectedServerError("Erro inesperado no servidor").setForbidden("Proibido")));
        return i18n;
    }

    private void processFile(File file) {
        if (file.length() <= CHUNK_SIZE) {
            OpenAiService openAiService = new OpenAiService(apiKey, Duration.ofHours(1));
            CreateTranscriptionRequest createTranscriptionRequest = new CreateTranscriptionRequest();
            createTranscriptionRequest.setModel("whisper-1");
            prompt = openAiService.createTranscription(createTranscriptionRequest, file).getText();
        }
    }

    private File convertInputStreamToFile(InputStream inputStream, String fileName) throws IOException {
        // Create a temporary file with the same file extension
        String[] split = fileName.split("\\.");
        String prefix = split[0];
        String suffix = split.length > 1 ? "." + split[1] : ".tmp";
        File tempFile = Files.createTempFile(prefix, suffix).toFile();

        // Write the InputStream to the File
        try (FileOutputStream outputStream = new FileOutputStream(tempFile)) {
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
        }

        // Ensure the file is deleted when the program exits
        tempFile.deleteOnExit();

        return tempFile;
    }

    public List<File> splitFile(InputStream inputStream, String fileName) throws IOException {
        List<File> files = new ArrayList<>();
        byte[] buffer = new byte[CHUNK_SIZE];
        int bytesRead;
        int partNumber = 0;

        while ((bytesRead = inputStream.read(buffer)) > 0) {
            String partFileName = String.format("%s_part%d.tmp", fileName, partNumber++);
            File partFile = Files.createTempFile(partFileName, ".mp3").toFile();
            try (FileOutputStream fos = new FileOutputStream(partFile)) {
                fos.write(buffer, 0, bytesRead);
            }
            partFile.deleteOnExit(); // Ensure temp file is deleted on exit
            files.add(partFile);
        }

        return files;
    }

    @Override
    public void beforeEnter(BeforeEnterEvent event) {
        getElement().executeJs("return document.documentElement.getAttribute('theme')").then(String.class, resultHandler -> {
            temaLumo = resultHandler;
            appView();
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
