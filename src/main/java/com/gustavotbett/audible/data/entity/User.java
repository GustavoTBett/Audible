package com.gustavotbett.audible.data.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gustavotbett.audible.data.AbstractEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_account")
public class User extends AbstractEntity {

    private String email;
    private String name;
    @JsonIgnore
    private String hashedPassword;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getHashedPassword() {
        return hashedPassword;
    }
    public void setHashedPassword(String hashedPassword) {
        this.hashedPassword = hashedPassword;
    }

}
