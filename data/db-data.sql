
-- Data

INSERT INTO smt.run_types (name) VALUES
('Easy'),
('Tempo'),
('Threshold'),
('Long'),
('Race'),
('Recovery'),
('Interval'),
('Other')
;

INSERT INTO smt.shoes (model, brand)
VALUES
  ('Metaspeed Sky Tokyo', 'Asics'),
  ('SC Elite V4', 'New Balance'),
  ('SC Trainer V3', 'New Balance'),
  ('SC Elite V3', 'New Balance'),
  ('SC Elite V5', 'New Balance'),
  ('Adizero Evo SL2', 'Adidas'),
  ('Vomero Premium', 'Nike')
ON CONFLICT (brand, model) DO NOTHING;

INSERT INTO smt.runs (date, distance_km, shoe_id, run_type_id)
VALUES
  ('2025-08-25', 21,   (SELECT id FROM smt.shoes WHERE model='Metaspeed Sky Tokyo'), (SELECT id FROM smt.run_types WHERE name='Race')),
  ('2025-09-25', 7.5,  (SELECT id FROM smt.shoes WHERE model='SC Elite V4'),         (SELECT id FROM smt.run_types WHERE name='Tempo')),
  ('2025-09-25', 8,    (SELECT id FROM smt.shoes WHERE model='SC Elite V4'),         (SELECT id FROM smt.run_types WHERE name='Threshold')),
  ('2025-09-25', 12,   (SELECT id FROM smt.shoes WHERE model='Metaspeed Sky Tokyo'), (SELECT id FROM smt.run_types WHERE name='Race')),
  ('2025-09-25', 13,   (SELECT id FROM smt.shoes WHERE model='SC Trainer V3'),       (SELECT id FROM smt.run_types WHERE name='Easy')),
  ('2025-10-25', 15,   (SELECT id FROM smt.shoes WHERE model='SC Elite V4'),         (SELECT id FROM smt.run_types WHERE name='Long')),
  ('2025-10-25', 7,    (SELECT id FROM smt.shoes WHERE model='SC Elite V3'),         (SELECT id FROM smt.run_types WHERE name='Threshold')),
  ('2025-10-25', 21,   (SELECT id FROM smt.shoes WHERE model='SC Elite V4'),         (SELECT id FROM smt.run_types WHERE name='Race')),
  ('2025-10-25', 8.5,  (SELECT id FROM smt.shoes WHERE model='SC Elite V4'),         (SELECT id FROM smt.run_types WHERE name='Long')),
  ('2025-10-25', 6,    (SELECT id FROM smt.shoes WHERE model='SC Elite V4'),         (SELECT id FROM smt.run_types WHERE name='Easy')),
  ('2025-10-25', 8,    (SELECT id FROM smt.shoes WHERE model='SC Elite V4'),         (SELECT id FROM smt.run_types WHERE name='Easy')),
  ('2025-10-25', 5,    (SELECT id FROM smt.shoes WHERE model='SC Elite V4'),         (SELECT id FROM smt.run_types WHERE name='Tempo')),
  ('2025-11-25', 8,    (SELECT id FROM smt.shoes WHERE model='SC Trainer V3'),       (SELECT id FROM smt.run_types WHERE name='Recovery')),
  ('2025-11-25', 14,   (SELECT id FROM smt.shoes WHERE model='SC Trainer V3'),       (SELECT id FROM smt.run_types WHERE name='Tempo')),
  ('2025-11-25', 10,   (SELECT id FROM smt.shoes WHERE model='Metaspeed Sky Tokyo'), (SELECT id FROM smt.run_types WHERE name='Interval')),
  ('2025-11-25', 10,   (SELECT id FROM smt.shoes WHERE model='SC Trainer V3'),       (SELECT id FROM smt.run_types WHERE name='Easy')),
  ('2025-11-25', 16,   (SELECT id FROM smt.shoes WHERE model='SC Elite V4'),         (SELECT id FROM smt.run_types WHERE name='Long')),
  ('2025-11-25', 11.4, (SELECT id FROM smt.shoes WHERE model='SC Trainer V3'),       (SELECT id FROM smt.run_types WHERE name='Easy')),
  ('2025-11-25', 8,    (SELECT id FROM smt.shoes WHERE model='SC Elite V5'),         (SELECT id FROM smt.run_types WHERE name='Threshold')),
  ('2025-11-25', 10,   (SELECT id FROM smt.shoes WHERE model='Adizero Evo SL2'),     (SELECT id FROM smt.run_types WHERE name='Interval')),
  ('2025-11-25', 10,   (SELECT id FROM smt.shoes WHERE model='Adizero Evo SL2'),     (SELECT id FROM smt.run_types WHERE name='Easy')),
  ('2025-11-25', 15,   (SELECT id FROM smt.shoes WHERE model='SC Elite V3'),         (SELECT id FROM smt.run_types WHERE name='Long')),
  ('2025-11-25', 9,    (SELECT id FROM smt.shoes WHERE model='Adizero Evo SL2'),     (SELECT id FROM smt.run_types WHERE name='Easy')),
  ('2025-11-25', 8,    (SELECT id FROM smt.shoes WHERE model='SC Elite V5'),         (SELECT id FROM smt.run_types WHERE name='Threshold')),
  ('2025-11-24', 14,   (SELECT id FROM smt.shoes WHERE model='Metaspeed Sky Tokyo'), (SELECT id FROM smt.run_types WHERE name='Tempo')),
  ('2025-11-21', 11.5, (SELECT id FROM smt.shoes WHERE model='Metaspeed Sky Tokyo'), (SELECT id FROM smt.run_types WHERE name='Threshold')),
  ('2025-11-20', 8,    (SELECT id FROM smt.shoes WHERE model='Vomero Premium'),      (SELECT id FROM smt.run_types WHERE name='Easy')),
  ('2025-11-19', 16,   (SELECT id FROM smt.shoes WHERE model='SC Elite V4'),         (SELECT id FROM smt.run_types WHERE name='Long')),
  ('2025-11-25', 10,   (SELECT id FROM smt.shoes WHERE model='Vomero Premium'),      (SELECT id FROM smt.run_types WHERE name='Easy')),
  ('2025-11-26', 10.5, (SELECT id FROM smt.shoes WHERE model='SC Elite V5'),         (SELECT id FROM smt.run_types WHERE name='Threshold')),
  ('2025-11-29', 7,    (SELECT id FROM smt.shoes WHERE model='SC Elite V4'),         (SELECT id FROM smt.run_types WHERE name='Tempo')),
  ('2025-11-30', 7,    (SELECT id FROM smt.shoes WHERE model='SC Elite V4'),         (SELECT id FROM smt.run_types WHERE name='Tempo')),
  ('2025-12-01', 5,    (SELECT id FROM smt.shoes WHERE model='SC Elite V4'),         (SELECT id FROM smt.run_types WHERE name='Easy')),
  ('2025-12-03', 6.5,  (SELECT id FROM smt.shoes WHERE model='Metaspeed Sky Tokyo'), (SELECT id FROM smt.run_types WHERE name='Threshold')),
  ('2025-12-04', 6,    (SELECT id FROM smt.shoes WHERE model='Vomero Premium'),      (SELECT id FROM smt.run_types WHERE name='Recovery')),
  ('2025-12-05', 5,    (SELECT id FROM smt.shoes WHERE model='Metaspeed Sky Tokyo'), (SELECT id FROM smt.run_types WHERE name='Interval')),
  ('2025-12-07', 21.1, (SELECT id FROM smt.shoes WHERE model='Metaspeed Sky Tokyo'), (SELECT id FROM smt.run_types WHERE name='Race')),

  -- BUFFER MILEAGE ENTRIES
  ('2025-08-01', 100,  (SELECT id FROM smt.shoes WHERE model='SC Elite V4'),         (SELECT id FROM smt.run_types WHERE name='Other')),
  ('2025-08-01', 50,   (SELECT id FROM smt.shoes WHERE model='SC Elite V3'),         (SELECT id FROM smt.run_types WHERE name='Other')),
  ('2025-08-01', 30,   (SELECT id FROM smt.shoes WHERE model='SC Trainer V3'),       (SELECT id FROM smt.run_types WHERE name='Other')),
  ('2025-08-01', 30,   (SELECT id FROM smt.shoes WHERE model='Metaspeed Sky Tokyo'), (SELECT id FROM smt.run_types WHERE name='Other'));

