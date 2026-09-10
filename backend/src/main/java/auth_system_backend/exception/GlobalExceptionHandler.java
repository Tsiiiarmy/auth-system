package auth_system_backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(AccountLockedException.class)
        public ResponseEntity<?> handleAccountLocked(
                AccountLockedException exception
) {

    Map<String, Object> response = new HashMap<>();

    response.put("success", false);
    response.put("message", exception.getMessage());

    return ResponseEntity
            .status(HttpStatus.LOCKED)
            .body(response);
}


    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgument(
            IllegalArgumentException exception
    ) {

        Map<String, Object> response = new HashMap<>();

        response.put("success", false);
        response.put("message", exception.getMessage());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(
            MethodArgumentNotValidException exception
    ) {

        Map<String, String> errors = new HashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        Map<String, Object> response = new HashMap<>();

        response.put("success", false);
        response.put("errors", errors);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

@ExceptionHandler(Exception.class)
public ResponseEntity<?> handleGeneralException(
        Exception exception
) {

    exception.printStackTrace();

    Map<String, Object> response = new HashMap<>();

    response.put("success", false);
    response.put(
            "message",
            exception.getMessage()
    );

    return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(response);
}
}