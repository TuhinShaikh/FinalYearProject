package uk.ac.rhul.CS3821.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.rhul.CS3821.model.Booking;
import uk.ac.rhul.CS3821.repository.BookingRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class BookingService {