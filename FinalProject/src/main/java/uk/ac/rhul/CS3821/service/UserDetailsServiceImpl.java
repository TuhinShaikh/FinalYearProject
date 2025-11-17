package uk.ac.rhul.CS3821.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;
import uk.ac.rhul.CS3821.repository.UserRepository;

import java.util.Collections;
