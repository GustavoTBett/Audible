package com.gustavotbett.audible.data.repository;


import com.gustavotbett.audible.data.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String username);
}
