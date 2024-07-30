package com.gustavotbett.audible.views.home;

import com.gustavotbett.audible.security.AuthenticatedUser;
import com.theokanning.openai.audio.CreateTranscriptionRequest;
import com.theokanning.openai.service.OpenAiService;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.Image;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.upload.Upload;
import com.vaadin.flow.component.upload.receivers.MultiFileMemoryBuffer;
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

@PageTitle("Home")
@Route(value = "")
@PermitAll
public class HomeView extends VerticalLayout {

    @Autowired
    private AuthenticatedUser authenticatedUser;

    @Value("${openai.api.key}")
    private String apiKey;

    private String prompt = "Please select an audio transcription";

    public HomeView() {
        setSpacing(false);

        Image img = new Image("images/empty-plant.png", "placeholder plant");
        img.setWidth("200px");
        add(img);

        H2 header = new H2("This place intentionally left empty");
        header.addClassNames(Margin.Top.XLARGE, Margin.Bottom.MEDIUM);
        add(header);
        add(new Paragraph("It’s a place where you can grow your own UI 🤗"));

        setSizeFull();
        setJustifyContentMode(JustifyContentMode.CENTER);
        setDefaultHorizontalComponentAlignment(Alignment.CENTER);
        getStyle().set("text-align", "center");

        MultiFileMemoryBuffer buffer = new MultiFileMemoryBuffer();
        Upload upload = new Upload(buffer);
        upload.setAcceptedFileTypes("application/mp3", ".mp3");
        upload.setAutoUpload(true);

        upload.addSucceededListener(event -> {
            String fileName = event.getFileName();
            InputStream inputStream = buffer.getInputStream(fileName);

            try {
                File tempFile = convertInputStreamToFile(inputStream, fileName);

                OpenAiService openAiService = new OpenAiService(apiKey);
                CreateTranscriptionRequest createTranscriptionRequest = new CreateTranscriptionRequest();
                createTranscriptionRequest.setModel("whisper-1");
                prompt = openAiService.createTranscription(createTranscriptionRequest, tempFile).getText();

                add(new Paragraph(prompt));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            // Do something with the file data
            // processFile(inputStream, fileName);
        });

        add(upload);

        Button btn = new Button("Click me");
        btn.addClickListener(e -> {
            authenticatedUser.logout();
        });
        add(btn);
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

}
