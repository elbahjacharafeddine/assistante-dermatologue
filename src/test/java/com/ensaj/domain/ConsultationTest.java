package com.ensaj.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.ensaj.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ConsultationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Consultation.class);
        Consultation consultation1 = new Consultation();
        consultation1.setId("id1");
        Consultation consultation2 = new Consultation();
        consultation2.setId(consultation1.getId());
        assertThat(consultation1).isEqualTo(consultation2);
        consultation2.setId("id2");
        assertThat(consultation1).isNotEqualTo(consultation2);
        consultation1.setId(null);
        assertThat(consultation1).isNotEqualTo(consultation2);
    }
}
