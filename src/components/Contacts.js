import React from 'react';
import { Container, Nav } from 'react-bootstrap';
import ContactsStack from './ContactsStack';

export default function Contacts() {
  const contacts = [{ link: 'https://www.linkedin.com/in/vystartas/', label: 'Linkedin' },
    { link: 'https://github.com/vystartasv', label: 'GitHub' }];
  return (
    <ContactsStack class="card mb-4 shadow-sm rounded" contacts={contacts} />
  );
}
